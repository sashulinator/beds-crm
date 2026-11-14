import { useState } from "react";
import type { Rent } from "../model/types";
import { RentCard } from "./RentCard";
import { Pagination } from "../../../shared/ui";

const PAGE_SIZE = 5;

interface RentListProps {
  rents: Rent[];
  loading: boolean;
  onReturn: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Список активных аренд с пагинацией. */
export function RentList({
  rents,
  loading,
  onReturn,
  onDelete,
}: RentListProps) {
  const active = rents.filter((r) => r.status === "active");
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(active.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = active.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="space-y-3">
      {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

      {!loading && active.length === 0 && (
        <p className="text-sm text-neutral-500">Нет активных аренд.</p>
      )}

      {visible.map((rent) => (
        <RentCard
          key={rent.id}
          rent={rent}
          onReturn={onReturn}
          onDelete={onDelete}
        />
      ))}

      <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
