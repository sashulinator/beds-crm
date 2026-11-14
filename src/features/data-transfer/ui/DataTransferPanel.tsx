// Панель экспорта/импорта данных приложения в бинарный формат .beds.

import { useRef, useState } from 'react';
import { useDataTransfer } from '../model/useDataTransfer';

interface DataTransferPanelProps {
  onImported: () => void;
}

export function DataTransferPanel({ onImported }: DataTransferPanelProps) {
  const { exportData, importData, exporting, importing, error } = useDataTransfer(onImported);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    try {
      await exportData();
    } catch {
      // ошибка уже сохранена в state
    }
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPendingFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleConfirmImport() {
    if (!pendingFile) return;
    setPendingFile(null);
    try {
      await importData(pendingFile);
    } catch {
      // ошибка уже сохранена в state
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="text-lg font-semibold">Экспорт / Импорт данных</h2>
      <p className="text-sm text-neutral-400">
        Сохраните все данные (кровати, аренды, фотографии) в файл .beds или загрузите их из файла.
        Импорт заменяет все текущие данные.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
        >
          {exporting ? 'Экспорт…' : 'Экспорт в файл'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="rounded-lg bg-neutral-700 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-600 active:scale-95 disabled:opacity-50"
        >
          {importing ? 'Импорт…' : 'Импорт из файла'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".beds,application/octet-stream"
          onChange={onFileSelected}
          className="hidden"
        />
      </div>

      {pendingFile && (
        <div className="space-y-2 rounded-lg border border-amber-900 bg-amber-950/40 p-3">
          <p className="text-sm text-amber-300">
            Файл <span className="font-mono">{pendingFile.name}</span> будет импортирован. Все
            текущие данные будут заменены.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmImport}
              disabled={importing}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium transition hover:bg-amber-500 active:scale-95 disabled:opacity-50"
            >
              {importing ? 'Импорт…' : 'Подтвердить импорт'}
            </button>
            <button
              onClick={() => setPendingFile(null)}
              disabled={importing}
              className="rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-600 active:scale-95 disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </section>
  );
}
