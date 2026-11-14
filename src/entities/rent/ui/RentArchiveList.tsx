import { useState } from "react";
import type { Rent } from "../model/types";
import { RentCard } from "./RentCard";
import { Pagination } from "../../../shared/ui";

const PAGE_SIZE = 5;

interface RentArchiveListProps {
  rents: Rent[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit?: (rent: Rent) => void;
}

/** Список архивных (закрытых) аренд с пагинацией. */
export function RentArchiveList({
  rents,
  loading,
  onDelete,
  onEdit,
}: RentArchiveListProps) {
  const returned = rents.filter((r) => r.status === "returned");
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(returned.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = returned.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="space-y-3">
      {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

      {!loading && returned.length === 0 && (
        <p className="text-sm text-neutral-500">Архив пуст.</p>
      )}

      {visible.map((rent) => (
        <RentCard key={rent.id} rent={rent} onDelete={onDelete} onEdit={onEdit} />
      ))}

      <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
