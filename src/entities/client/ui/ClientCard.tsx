import type { Client } from "../model/types";

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
  onEdit?: (client: Client) => void;
}

/** Карточка одного клиента: имя, телефон, примечание, действия. */
export function ClientCard({ client, onDelete, onEdit }: ClientCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium">{client.name}</h3>
          <p className="text-sm text-neutral-400">
            {client.phone && `Тел: ${client.phone} · `}
            {new Date(client.createdAt).toLocaleDateString("ru-RU")}
          </p>
          {client.note && (
            <p className="mt-1 text-sm text-neutral-500">{client.note}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(client)}
              className="rounded-lg bg-neutral-700 px-3 py-1.5 text-xs font-medium hover:bg-neutral-600"
            >
              Редактировать
            </button>
          )}
          <button
            onClick={() => onDelete(client.id)}
            className="rounded-lg bg-red-900/60 px-3 py-1.5 text-xs font-medium hover:bg-red-800"
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}
