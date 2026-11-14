import { useState } from "react";
import type { Bed } from "../model/types";
import { BedCard } from "./BedCard";
import { Pagination } from "../../../shared/ui";

const PAGE_SIZE = 5;

interface BedListProps {
  beds: Bed[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit?: (bed: Bed) => void;
}

/** Список кроватей с пагинацией. */
export function BedList({ beds, loading, onDelete, onEdit }: BedListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(beds.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = beds.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="space-y-3">
      {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

      {!loading && beds.length === 0 && (
        <p className="text-sm text-neutral-500">Кровати ещё не добавлены.</p>
      )}

      {visible.map((bed) => (
        <BedCard key={bed.id} bed={bed} onDelete={onDelete} onEdit={onEdit} />
      ))}

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}
