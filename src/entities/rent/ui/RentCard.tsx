import type { Rent } from '../model/types';

interface RentCardProps {
  rent: Rent;
  onReturn?: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Карточка одной аренды: товар, клиент, дата, фото, действия. */
export function RentCard({ rent, onReturn, onDelete }: RentCardProps) {
  const isReturned = rent.status === 'returned';

  return (
    <article
      className={
        'space-y-3 rounded-xl border border-neutral-800 p-4 ' +
        (isReturned ? 'bg-neutral-900/50' : 'bg-neutral-900')
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className={'font-medium ' + (isReturned ? 'text-neutral-400' : '')}>
            {rent.itemTitle}
          </h3>
          <p className={'text-sm ' + (isReturned ? 'text-neutral-500' : 'text-neutral-400')}>
            Клиент: {rent.clientName} · Выдано: {new Date(rent.issuedAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <div className="flex gap-2">
          {onReturn && (
            <button
              onClick={() => onReturn(rent.id)}
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium hover:bg-emerald-600"
            >
              Вернуть
            </button>
          )}
          <button
            onClick={() => onDelete(rent.id)}
            className="rounded-lg bg-red-900/60 px-3 py-1.5 text-xs font-medium hover:bg-red-800"
          >
            Удалить
          </button>
        </div>
      </div>

      {rent.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {rent.photos.map((blob, i) => (
            <img
              key={i}
              src={URL.createObjectURL(blob)}
              alt={`Фото ${i + 1}`}
              className="h-24 w-24 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
}
