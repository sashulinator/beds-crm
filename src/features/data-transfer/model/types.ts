// Формат бинарного файла экспорта/импорта (.beds).
//
// Структура файла:
//   [0..3]   магическое число "BEDS"
//   [4..5]   версия формата (uint16 LE)
//   [6..7]   количество секций (uint16 LE) — пока всегда 2 (beds, rents)
//   далее    секции, каждая:
//     [0..3]   длина секции в байтах (uint32 LE)
//     [4..5]   тип секции (uint16 LE): 1 = beds, 2 = rents
//     [6..]    содержимое секции (см. ниже)
//
// Содержимое секции:
//   [0..3]   количество элементов (uint32 LE)
//   далее    элементы, каждый:
//     [0..3]   длина JSON-части элемента (uint32 LE)
//     [4..]    JSON-часть (UTF-8) — все поля, кроме blob-полей
//     далее    blob-поля, по одному:
//       для одиночного blob:
//         [0..1]   флаг: 1 = есть, 0 = null (uint16 LE)
//         если 1: [0..3] длина (uint32 LE) + байты
//       для массива blob:
//         [0..3]   количество элементов (uint32 LE)
//         далее по элементу: [0..3] длина (uint32 LE) + байты
//         (элементы массива не бывают null — пустой массив = 0 элементов)
//
// Порядок blob-полей зафиксирован:
//   beds:  photo
//   rents: photos

export type BlobField = { type: 'blob' } | { type: 'blob-array' };

export interface RecordSpec {
  /** Название сущности (для читаемости и отладки). */
  entity: string;
  /** Порядок blob-полей в бинарной записи. */
  blobFields: BlobField[];
  /** Ключи, которые НЕ сериализуются в JSON (они идут бинарно). */
  binaryKeys: string[];
}

export const BEDS_SPEC: RecordSpec = {
  entity: 'beds',
  blobFields: [{ type: 'blob' }],
  binaryKeys: ['photo'],
};

export const RENTS_SPEC: RecordSpec = {
  entity: 'rents',
  blobFields: [{ type: 'blob-array' }],
  binaryKeys: ['photos'],
};

export const SECTION_BEDS = 1;
export const SECTION_RENTS = 2;

export const MAGIC = new Uint8Array([0x42, 0x45, 0x44, 0x53]); // "BEDS"
export const FORMAT_VERSION = 1;
