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

/** Список всех аренд, разделённый на активные и возвращённые, с пагинацией. */
export function RentList({
  rents,
  loading,
  onReturn,
  onDelete,
}: RentListProps) {
  const active = rents.filter((r) => r.status === "active");
  const returned = rents.filter((r) => r.status === "returned");

  const [activePage, setActivePage] = useState(1);
  const [returnedPage, setReturnedPage] = useState(1);

  const activeTotalPages = Math.ceil(active.length / PAGE_SIZE);
  const returnedTotalPages = Math.ceil(returned.length / PAGE_SIZE);

  const safeActivePage = Math.min(activePage, Math.max(activeTotalPages, 1));
  const safeReturnedPage = Math.min(
    returnedPage,
    Math.max(returnedTotalPages, 1)
  );

  const visibleActive = active.slice(
    (safeActivePage - 1) * PAGE_SIZE,
    safeActivePage * PAGE_SIZE
  );
  const visibleReturned = returned.slice(
    (safeReturnedPage - 1) * PAGE_SIZE,
    safeReturnedPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8">
      {/* Активные */}
      <section className="space-y-3">
        {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

        {!loading && active.length === 0 && (
          <p className="text-sm text-neutral-500">Нет активных аренд.</p>
        )}

        {visibleActive.map((rent) => (
          <RentCard
            key={rent.id}
            rent={rent}
            onReturn={onReturn}
            onDelete={onDelete}
          />
        ))}

        <Pagination
          page={safeActivePage}
          totalPages={activeTotalPages}
          onPageChange={setActivePage}
        />
      </section>

      {/* Возвращённые */}
      {returned.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Архив{" "}
            <span className="text-sm text-neutral-500">
              ({returned.length})
            </span>
          </h2>
          {visibleReturned.map((rent) => (
            <RentCard key={rent.id} rent={rent} onDelete={onDelete} />
          ))}
          <Pagination
            page={safeReturnedPage}
            totalPages={returnedTotalPages}
            onPageChange={setReturnedPage}
          />
        </section>
      )}
    </div>
  );
}
