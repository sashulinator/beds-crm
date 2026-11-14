import type { Bed } from "../model/types";
import { BedCard } from "./BedCard";

interface BedListProps {
  beds: Bed[];
  loading: boolean;
  onDelete: (id: string) => void;
}

/** Список всех кроватей. */
export function BedList({ beds, loading, onDelete }: BedListProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold"></h2>

      {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

      {!loading && beds.length === 0 && (
        <p className="text-sm text-neutral-500">Кровати ещё не добавлены.</p>
      )}

      {beds.map((bed) => (
        <BedCard key={bed.id} bed={bed} onDelete={onDelete} />
      ))}
    </section>
  );
}
