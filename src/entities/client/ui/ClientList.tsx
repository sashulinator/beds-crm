import { useState } from "react";
import type { Client } from "../model/types";
import { ClientCard } from "./ClientCard";
import { Pagination } from "../../../shared/ui";

const PAGE_SIZE = 5;

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit?: (client: Client) => void;
}

/** Список клиентов с пагинацией. */
export function ClientList({
  clients,
  loading,
  onDelete,
  onEdit,
}: ClientListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(clients.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visible = clients.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <section className="space-y-3">
      {loading && <p className="text-sm text-neutral-500">Загрузка…</p>}

      {!loading && clients.length === 0 && (
        <p className="text-sm text-neutral-500">Клиенты ещё не добавлены.</p>
      )}

      {visible.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}
