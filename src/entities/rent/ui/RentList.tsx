import type { Rent } from "../model/types";
import { RentCard } from "./RentCard";

interface RentListProps {
  rents: Rent[];
  loading: boolean;
  onReturn: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Список всех аренд, разделённый на активные и возвращённые. */
export function RentList({ rents, onDelete }: RentListProps) {
  const returned = rents.filter((r) => r.status === "returned");

  return (
    <div className="space-y-8">
      {/* Возвращённые */}
      {returned.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Свободные{" "}
            <span className="text-sm text-neutral-500">
              ({returned.length})
            </span>
          </h2>
          {returned.map((rent) => (
            <RentCard key={rent.id} rent={rent} onDelete={onDelete} />
          ))}
        </section>
      )}
    </div>
  );
}
