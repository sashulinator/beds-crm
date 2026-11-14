// Карточка со статистикой аренд: количество активных и возвращённых.

import type { Rent } from "../model/types";

interface RentStatsProps {
  rents: Rent[];
  loading: boolean;
}

export function RentStats({ rents, loading }: RentStatsProps) {
  const active = rents.filter((r) => r.status === "active").length;
  const returned = rents.filter((r) => r.status === "returned").length;

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-sm text-neutral-400">Активные аренды</p>
        {loading ? (
          <p className="mt-2 text-3xl font-bold text-neutral-500">…</p>
        ) : (
          <p className="mt-2 text-3xl font-bold text-emerald-400">{active}</p>
        )}
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-sm text-neutral-400">Свободные кровати</p>
        {loading ? (
          <p className="mt-2 text-3xl font-bold text-neutral-500">…</p>
        ) : (
          <p className="mt-2 text-3xl font-bold text-neutral-300">{returned}</p>
        )}
      </div>
    </section>
  );
}
