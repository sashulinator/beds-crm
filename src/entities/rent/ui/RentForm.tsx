import { useRef, useState } from "react";
import { useIssueRent } from "../model/useIssueRent";
import { updateRent } from "../model/api";
import { useBedList, ENGINE_COLORS } from "../../bed";
import { useClientList } from "../../client";
import type { Rent } from "../model/types";

interface RentFormProps {
  onSaved: () => void;
  /** Если передана — форма в режиме редактирования. */
  rent?: Rent;
}

/** Форма выдачи или редактирования аренды. */
export function RentForm({ onSaved, rent }: RentFormProps) {
  const isEdit = Boolean(rent);
  const [bedId, setBedId] = useState(rent?.bedId ?? "");
  const [clientId, setClientId] = useState(rent?.clientId ?? "");
  const [clientName, setClientName] = useState(rent?.clientName ?? "");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { beds } = useBedList();
  const { clients } = useClientList();
  const { issue, saving } = useIssueRent(onSaved);

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(e.target.files ?? []));
  }

  function onClientSelected(id: string) {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      setClientName(client.name);
    }
  }

  async function handleSubmit() {
    setError("");

    if (!bedId) {
      setError("Выберите кровать");
      return;
    }
    if (!clientName.trim()) {
      setError("Укажите имя клиента");
      return;
    }

    try {
      if (isEdit && rent) {
        let photoBlobs = rent.photos;
        if (photos.length > 0) {
          photoBlobs = await Promise.all(
            photos.map((file) =>
              file.arrayBuffer().then((buf) => new Blob([buf]))
            )
          );
        }
        await updateRent({
          ...rent,
          bedId,
          clientId: clientId || undefined,
          clientName: clientName.trim(),
          photos: photoBlobs,
        });
        onSaved();
      } else {
        await issue(bedId, clientName.trim(), photos, clientId || undefined);
      }
      setBedId("");
      setClientId("");
      setClientName("");
      setPhotos([]);
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
      <h2 className="text-lg font-semibold">
        {isEdit ? "Редактировать аренду" : "Выдать в аренду"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-neutral-300">Кровать</span>
          <select
            value={bedId}
            onChange={(e) => setBedId(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">— выберите кровать —</option>
            {beds.map((bed) => (
              <option key={bed.id} value={bed.id}>
                {bed.title} (№ {bed.number}, {ENGINE_COLORS[bed.engine]})
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-neutral-300">Клиент из списка</span>
          <select
            value={clientId}
            onChange={(e) => onClientSelected(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">— не выбран —</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
                {client.phone ? ` (${client.phone})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm text-neutral-300">Имя клиента</span>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Имя клиента"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-neutral-300">
          Фотографии кровати (до выдачи) — можно несколько
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
        {saving ? "Сохранение…" : isEdit ? "Сохранить" : "Выдать в аренду"}
      </button>
    </section>
  );
}
