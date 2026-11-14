import { useRef, useState } from "react";
import { useAddBed } from "../model/useAddBed";
import { ENGINE_COLORS, type EngineColor } from "../model/types";

interface BedFormProps {
  onSaved: () => void;
}

/** Форма добавления кровати: название, номер, двигатель, фото. */
export function BedForm({ onSaved }: BedFormProps) {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [engine, setEngine] = useState<EngineColor>(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { add, saving } = useAddBed(onSaved);

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
  }

  async function handleSubmit() {
    setError("");

    if (!title.trim()) {
      setError("Укажите название кровати");
      return;
    }
    if (!number.trim()) {
      setError("Укажите номер кровати");
      return;
    }

    try {
      await add(title.trim(), number.trim(), engine, photo);
      setTitle("");
      setNumber("");
      setEngine(1);
      setPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        "Ошибка сохранения: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <h2 className="text-lg font-semibold">Добавить кровать</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-neutral-300">Название</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Кровать «Комфорт»"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-neutral-300">№ кровати</span>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Буквы и цифры, напр. A1"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </label>
      </div>

      <div className="space-y-1">
        <span className="text-sm text-neutral-300">Двигатель</span>
        <div className="flex gap-2">
          {([1, 2, 3] as EngineColor[]).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setEngine(val)}
              className={
                "rounded-lg px-4 py-2 text-sm font-medium transition " +
                (engine === val
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700")
              }
            >
              {val} — {ENGINE_COLORS[val]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-sm text-neutral-300">Фото</span>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelected}
            className="flex-1 text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
          />
        </div>
      </div>

      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="Превью"
          className="h-32 w-32 rounded-lg object-cover"
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
      >
        {saving ? "Сохранение…" : "Добавить кровать"}
      </button>
    </section>
  );
}
