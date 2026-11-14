import { useRef, useState } from 'react';

interface RentFormProps {
  onSubmit: (itemTitle: string, clientName: string, photos: File[]) => Promise<void>;
}

/** Форма выдачи товара в аренду: название, клиент, фото до выдачи. */
export default function RentForm({ onSubmit }: RentFormProps) {
  const [itemTitle, setItemTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(e.target.files ?? []));
  }

  async function handleSubmit() {
    setError('');

    if (!itemTitle.trim()) {
      setError('Укажите название товара');
      return;
    }
    if (!clientName.trim()) {
      setError('Укажите имя клиента');
      return;
    }

    setSaving(true);
    try {
      await onSubmit(itemTitle.trim(), clientName.trim(), photos);
      // Сбрасываем форму после успешного сохранения.
      setItemTitle('');
      setClientName('');
      setPhotos([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError('Ошибка сохранения: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="text-lg font-semibold">Выдать в аренду</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-neutral-300">Товар</span>
          <input
            type="text"
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            placeholder="Например: Матрас «Ортопедик»"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-neutral-300">Клиент</span>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Имя клиента"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm text-neutral-300">
          Фотографии товара (до выдачи) — можно несколько
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesSelected}
          className="w-full text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
        />
      </label>

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
      >
        {saving ? 'Сохранение…' : 'Выдать в аренду'}
      </button>
    </section>
  );
}
