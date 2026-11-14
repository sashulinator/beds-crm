// Страница «Кровати»: форма добавления и список.

import { BedForm, BedList, useBedList } from "../../entities/bed";

export function BedsPage() {
  const { beds, loading, handleDelete, refresh } = useBedList();

  function goBack() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <button
            onClick={goBack}
            className="text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← На главную
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Кровати</h1>
        </header>

        <BedForm onSaved={refresh} />
        <BedList beds={beds} loading={loading} onDelete={handleDelete} />
      </div>
    </main>
  );
}
