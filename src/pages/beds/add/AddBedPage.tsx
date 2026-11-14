// Страница «Добавить кровать»: форма добавления.

import { BedForm } from "../../../entities/bed";

export function AddBedPage() {
  function goBack() {
    window.history.pushState({}, "", "/beds");
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
            ← К кроватям
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Добавить кровать
          </h1>
        </header>

        <BedForm onSaved={goBack} />
      </div>
    </main>
  );
}
