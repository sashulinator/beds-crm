// Хук экспорта/импорта всех данных приложения в бинарный формат .beds.
// Экспорт: собирает beds + rents из IndexedDB, сериализует, скачивает файл.
// Импорт: читает файл, десериализует, очищает текущие данные и пишет новые.

import { useCallback, useState } from 'react';
import { getBeds, addBed, deleteBed } from '../../../entities/bed';
import { getRents, addRent, deleteRent } from '../../../entities/rent';
import { deserializeAll, serializeAll } from './serializer';

const FILE_NAME = 'beds-export.beds';

export function useDataTransfer(onImported: () => void) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const [beds, rents] = await Promise.all([getBeds(), getRents()]);

      const buffer = await serializeAll(
        beds as unknown as Record<string, unknown>[],
        rents as unknown as Record<string, unknown>[],
      );

      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = FILE_NAME;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Ошибка экспорта: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  const importData = useCallback(
    async (file: File) => {
      setImporting(true);
      setError(null);
      try {
        const buffer = await file.arrayBuffer();
        const { beds, rents } = deserializeAll(buffer);

        // Очищаем текущие данные.
        const [existingBeds, existingRents] = await Promise.all([getBeds(), getRents()]);
        await Promise.all([
          ...existingBeds.map((b) => deleteBed(b.id)),
          ...existingRents.map((r) => deleteRent(r.id)),
        ]);

        // Записываем импортированные данные.
        await Promise.all(
          beds.map((b) => addBed(b as unknown as Parameters<typeof addBed>[0])),
        );
        await Promise.all(
          rents.map((r) => addRent(r as unknown as Parameters<typeof addRent>[0])),
        );

        onImported();
      } catch (err) {
        setError('Ошибка импорта: ' + (err instanceof Error ? err.message : String(err)));
        throw err;
      } finally {
        setImporting(false);
      }
    },
    [onImported],
  );

  return { exportData, importData, exporting, importing, error, setError };
}
