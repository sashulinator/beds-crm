import type { Rent } from '../model/types';
import { RentCard } from './RentCard';

interface RentListProps {
  rents: Rent[];
  loading: boolean;
  onReturn: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Список всех аренд, разделённый на активные и возвращённые. */
export function RentList({ rents, loading, onReturn, onDelete }: RentListProps) {
  const active = rents.filter((r) => r.status === 'active');
  const returned = rents.filter((r) => r.status === 'returned');

  return (
    <div className="space-y-8">
      {/* Активные */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Активные аренды <span className="text-sm text-neutral-500">({active.length})</span>
        </h2>

        {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

        {!loading && active.length === 0 && (
          <p className="text-sm text-neutral-500">Нет активных аренд.</p>
        )}

        {active.map((rent) => (
          <RentCard key={rent.id} rent={rent} onReturn={onReturn} onDelete={onDelete} />
        ))}
      </section>

      {/* Возвращённые */}
      {returned.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Возвращены <span className="text-sm text-neutral-500">({returned.length})</span>
          </h2>
          {returned.map((rent) => (
            <RentCard key={rent.id} rent={rent} onDelete={onDelete} />
          ))}
        </section>
      )}
    </div>
  );
}
