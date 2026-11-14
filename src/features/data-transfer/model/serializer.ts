// Бинарный сериализатор/десериализатор данных приложения.
// JSON-поля кодируются UTF-8, blob-поля (фото) — сырыми байтами.

import {
  BEDS_SPEC,
  FORMAT_VERSION,
  MAGIC,
  RENTS_SPEC,
  SECTION_BEDS,
  SECTION_RENTS,
  type RecordSpec,
} from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

/** Читает Blob в Uint8Array. */
async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Разделяет запись на JSON-часть (без blob-полей) и массив blob-значений
 * в порядке spec.blobFields. Для blob-array раскатывает массив в последовательность.
 */
function splitRecord(
  spec: RecordSpec,
  record: Record<string, unknown>,
): { json: string; blobs: (Blob | null)[] } {
  const jsonPart: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!spec.binaryKeys.includes(key)) {
      jsonPart[key] = value;
    }
  }

  const blobs: (Blob | null)[] = [];
  for (const field of spec.blobFields) {
    const value = record[spec.binaryKeys[0]];
    if (field.type === 'blob') {
      blobs.push((value as Blob | null) ?? null);
    } else {
      const arr = (value as Blob[] | null) ?? [];
      for (const item of arr) blobs.push(item);
    }
  }

  return { json: JSON.stringify(jsonPart), blobs };
}

/** Собирает blob-значения обратно в поля записи. */
function mergeRecord(
  spec: RecordSpec,
  jsonPart: Record<string, unknown>,
  blobs: (Blob | null)[],
): Record<string, unknown> {
  const record: Record<string, unknown> = { ...jsonPart };

  let idx = 0;
  for (const field of spec.blobFields) {
    if (field.type === 'blob') {
      record[spec.binaryKeys[0]] = blobs[idx] ?? null;
      idx += 1;
    } else {
      const arr: Blob[] = [];
      while (idx < blobs.length) {
        const b = blobs[idx];
        if (b) arr.push(b);
        idx += 1;
      }
      record[spec.binaryKeys[0]] = arr;
    }
  }

  return record;
}

/** Сериализует секцию: заголовок + записи. */
async function serializeSection(
  spec: RecordSpec,
  records: Record<string, unknown>[],
): Promise<Uint8Array> {
  const prepared = records.map((r) => splitRecord(spec, r));

  // Преобразуем все blob в Uint8Array заранее.
  const allBlobBytes: (Uint8Array | null)[] = [];
  for (const { blobs } of prepared) {
    for (const blob of blobs) {
      allBlobBytes.push(blob ? await blobToBytes(blob) : null);
    }
  }

  // Считаем размер секции.
  let total = 4; // количество элементов
  let blobIdx = 0;
  for (const { json } of prepared) {
    const jsonBytes = encoder.encode(json);
    let recordSize = 4 + jsonBytes.length;
    for (const field of spec.blobFields) {
      if (field.type === 'blob') {
        const bytes = allBlobBytes[blobIdx];
        recordSize += 2 + (bytes ? 4 + bytes.length : 0);
        blobIdx += 1;
      } else {
        // blob-array: считаем количество элементов.
        // Определяем по количеству blob-значений, принадлежащих этому полю.
        // Так как blob-array — последнее поле в spec, считаем до конца allBlobBytes.
        let arrCount = 0;
        let i = blobIdx;
        while (i < allBlobBytes.length) {
          arrCount++;
          i++;
        }
        recordSize += 4; // количество элементов массива
        for (let j = 0; j < arrCount; j++) {
          const b = allBlobBytes[blobIdx + j];
          if (b) recordSize += 4 + b.length;
        }
        blobIdx += arrCount;
      }
    }
    total += recordSize;
  }

  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  writeUint32(view, 0, records.length);

  let offset = 4;
  blobIdx = 0;
  for (const { json } of prepared) {
    const jsonBytes = encoder.encode(json);
    writeUint32(view, offset, jsonBytes.length);
    offset += 4;
    out.set(jsonBytes, offset);
    offset += jsonBytes.length;

    for (const field of spec.blobFields) {
      if (field.type === 'blob') {
        const bytes = allBlobBytes[blobIdx];
        if (bytes) {
          writeUint16(view, offset, 1);
          offset += 2;
          writeUint32(view, offset, bytes.length);
          offset += 4;
          out.set(bytes, offset);
          offset += bytes.length;
        } else {
          writeUint16(view, offset, 0);
          offset += 2;
        }
        blobIdx += 1;
      } else {
        // blob-array: количество элементов + последовательность (длина, байты)
        let arrCount = 0;
        let i = blobIdx;
        while (i < allBlobBytes.length) {
          arrCount++;
          i++;
        }
        writeUint32(view, offset, arrCount);
        offset += 4;
        for (let j = 0; j < arrCount; j++) {
          const b = allBlobBytes[blobIdx + j];
          if (b) {
            writeUint32(view, offset, b.length);
            offset += 4;
            out.set(b, offset);
            offset += b.length;
          }
        }
        blobIdx += arrCount;
      }
    }
  }

  return out;
}

/** Сериализует все данные приложения в один бинарный буфер. */
export async function serializeAll(
  beds: Record<string, unknown>[],
  rents: Record<string, unknown>[],
): Promise<ArrayBuffer> {
  const [bedsSection, rentsSection] = await Promise.all([
    serializeSection(BEDS_SPEC, beds),
    serializeSection(RENTS_SPEC, rents),
  ]);

  const headerSize = 4 + 2 + 2;
  const bedsSectionSize = 4 + 2 + bedsSection.length;
  const rentsSectionSize = 4 + 2 + rentsSection.length;

  const out = new Uint8Array(headerSize + bedsSectionSize + rentsSectionSize);
  const view = new DataView(out.buffer);

  out.set(MAGIC, 0);
  writeUint16(view, 4, FORMAT_VERSION);
  writeUint16(view, 6, 2); // количество секций

  let offset = headerSize;

  writeUint32(view, offset, bedsSection.length);
  offset += 4;
  writeUint16(view, offset, SECTION_BEDS);
  offset += 2;
  out.set(bedsSection, offset);
  offset += bedsSection.length;

  writeUint32(view, offset, rentsSection.length);
  offset += 4;
  writeUint16(view, offset, SECTION_RENTS);
  offset += 2;
  out.set(rentsSection, offset);

  return out.buffer;
}

export interface DeserializedData {
  beds: Record<string, unknown>[];
  rents: Record<string, unknown>[];
}

/** Разбирает секцию обратно в записи. */
function parseSection(spec: RecordSpec, sectionBytes: Uint8Array): Record<string, unknown>[] {
  const view = new DataView(sectionBytes.buffer, sectionBytes.byteOffset, sectionBytes.byteLength);
  const count = readUint32(view, 0);
  let offset = 4;

  const records: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i++) {
    const jsonLength = readUint32(view, offset);
    offset += 4;

    const jsonBytes = sectionBytes.slice(offset, offset + jsonLength);
    offset += jsonLength;
    const jsonPart = JSON.parse(decoder.decode(jsonBytes)) as Record<string, unknown>;

    const blobs: (Blob | null)[] = [];
    for (const field of spec.blobFields) {
      if (field.type === 'blob') {
        const present = readUint16(view, offset);
        offset += 2;
        if (present) {
          const blobLength = readUint32(view, offset);
          offset += 4;
          const blobBytes = sectionBytes.slice(offset, offset + blobLength);
          offset += blobLength;
          blobs.push(new Blob([blobBytes]));
        } else {
          blobs.push(null);
        }
      } else {
        const arrCount = readUint32(view, offset);
        offset += 4;
        for (let j = 0; j < arrCount; j++) {
          const blobLength = readUint32(view, offset);
          offset += 4;
          const blobBytes = sectionBytes.slice(offset, offset + blobLength);
          offset += blobLength;
          blobs.push(new Blob([blobBytes]));
        }
      }
    }

    records.push(mergeRecord(spec, jsonPart, blobs));
  }

  return records;
}

/** Разбирает бинарный буфер обратно в данные приложения. */
export function deserializeAll(buffer: ArrayBuffer): DeserializedData {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  for (let i = 0; i < MAGIC.length; i++) {
    if (bytes[i] !== MAGIC[i]) {
      throw new Error('Неверный формат файла: ожидался файл .beds');
    }
  }

  const version = readUint16(view, 4);
  if (version !== FORMAT_VERSION) {
    throw new Error(`Неподдерживаемая версия формата: ${version}`);
  }

  const sectionCount = readUint16(view, 6);
  let offset = 4 + 2 + 2;

  const result: DeserializedData = { beds: [], rents: [] };

  for (let s = 0; s < sectionCount; s++) {
    const sectionLength = readUint32(view, offset);
    offset += 4;
    const sectionType = readUint16(view, offset);
    offset += 2;

    const sectionBytes = bytes.slice(offset, offset + sectionLength);
    offset += sectionLength;

    if (sectionType === SECTION_BEDS) {
      result.beds = parseSection(BEDS_SPEC, sectionBytes);
    } else if (sectionType === SECTION_RENTS) {
      result.rents = parseSection(RENTS_SPEC, sectionBytes);
    }
    // Неизвестные секции пропускаем — это позволяет добавлять новые
    // сущности в будущем без поломки старых файлов.
  }

  return result;
}
