import type { Bed } from '../model/types';
import { ENGINE_COLORS } from '../model/types';

interface BedCardProps {
  bed: Bed;
  onDelete: (id: string) => void;
}

/** Карточка одной кровати: название, номер, двигатель, фото, действия. */
export function BedCard({ bed, onDelete }: BedCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-medium">{bed.title}</h3>
          <p className="text-sm text-neutral-400">
            № {bed.number} · Двигатель: {ENGINE_COLORS[bed.engine]} ·{' '}
            {new Date(bed.createdAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <button
          onClick={() => onDelete(bed.id)}
          className="rounded-lg bg-red-900/60 px-3 py-1.5 text-xs font-medium hover:bg-red-800"
        >
          Удалить
        </button>
      </div>

      {bed.photo && (
        <img
          src={URL.createObjectURL(bed.photo)}
          alt={`Фото: ${bed.title}`}
          className="h-32 w-32 rounded-lg object-cover"
        />
      )}
    </article>
  );
}
