// Страница «Кровати»: список.

import { BedList, useBedList, type Bed } from "../../entities/bed";

export function BedsPage() {
  const { beds, loading, handleDelete } = useBedList();

  function goBack() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goToAddBed() {
    window.history.pushState({}, "", "/beds/add");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function handleEdit(bed: Bed) {
    window.history.pushState({}, "", `/beds/edit/${bed.id}`);
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
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Кровати</h1>
            <button
              onClick={goToAddBed}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95"
            >
              + Добавить
            </button>
          </div>
        </header>

        <BedList
          beds={beds}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
