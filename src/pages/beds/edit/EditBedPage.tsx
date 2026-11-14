// Страница «Редактировать кровать»: форма редактирования.

import { useEffect, useState } from "react";
import { BedForm, getBeds, type Bed } from "../../../entities/bed";

export function EditBedPage({ bedId }: { bedId: string }) {
  const [bed, setBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBeds().then((beds) => {
      setBed(beds.find((b) => b.id === bedId) ?? null);
      setLoading(false);
    });
  }, [bedId]);

  function goBack() {
    window.history.pushState({}, "", "/beds");
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

  if (!bed) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Кровать не найдена.</p>
          <button
            onClick={goBack}
            className="mt-4 text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← К кроватям
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
            ← К кроватям
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Редактировать кровать
          </h1>
        </header>

        <BedForm bed={bed} onSaved={goBack} />
      </div>
    </main>
  );
}
