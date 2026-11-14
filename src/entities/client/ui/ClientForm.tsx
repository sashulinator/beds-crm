import { useState } from "react";
import { useAddClient } from "../model/useAddClient";
import { updateClient } from "../model/api";
import type { Client } from "../model/types";

interface ClientFormProps {
  onSaved: () => void;
  /** Если передана — форма в режиме редактирования. */
  client?: Client;
}

/** Форма добавления или редактирования клиента. */
export function ClientForm({ onSaved, client }: ClientFormProps) {
  const isEdit = Boolean(client);
  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [note, setNote] = useState(client?.note ?? "");
  const [error, setError] = useState("");

  const { add, saving } = useAddClient(onSaved);

  async function handleSubmit() {
    setError("");

    if (!name.trim()) {
      setError("Укажите имя клиента");
      return;
    }

    try {
      if (isEdit && client) {
        await updateClient({
          ...client,
          name: name.trim(),
          phone: phone.trim(),
          note: note.trim(),
        });
        onSaved();
      } else {
        await add(name, phone, note);
      }
      setName("");
      setPhone("");
      setNote("");
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
        {isEdit ? "Редактировать клиента" : "Добавить клиента"}
      </h2>

      <label className="space-y-1">
        <span className="text-sm text-neutral-300">Имя</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя клиента"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm text-neutral-300">Телефон</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm text-neutral-300">Примечание</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Любая информация о клиенте"
          rows={3}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
      >
        {saving ? "Сохранение…" : isEdit ? "Сохранить" : "Добавить клиента"}
      </button>
    </section>
  );
}
