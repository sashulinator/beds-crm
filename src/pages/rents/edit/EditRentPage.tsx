// Страница «Редактировать аренду»: форма редактирования.

import { useEffect, useState } from "react";
import { RentForm, getRents, type Rent } from "../../../entities/rent";

export function EditRentPage({ rentId }: { rentId: string }) {
  const [rent, setRent] = useState<Rent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRents().then((rents) => {
      setRent(rents.find((r) => r.id === rentId) ?? null);
      setLoading(false);
    });
  }, [rentId]);

  function goBack() {
    // Возвращаемся на страницу аренд или в архив в зависимости от статуса.
    const status = rent?.status;
    window.history.pushState({}, "", status === "returned" ? "/rents/archive" : "/rents");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Загрузка…</p>
        </div>
      </main>
    );
  }

  if (!rent) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Аренда не найдена.</p>
          <button
            onClick={goBack}
            className="mt-4 text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← К арендам
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <button
            onClick={goBack}
            className="text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← {rent.status === "returned" ? "К архиву" : "К арендам"}
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Редактировать аренду
          </h1>
        </header>

        <RentForm rent={rent} onSaved={goBack} />
      </div>
    </main>
  );
}
