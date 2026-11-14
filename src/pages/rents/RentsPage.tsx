// Страница «Аренда»: формы выдачи и списки.

import { BedList, useBedList } from "../../entities/bed";
import { RentForm, RentList, useRentList } from "../../entities/rent";

export function RentsPage() {
  const {
    rents,
    loading: rentLoading,
    handleReturn,
    handleDelete: handleRentDelete,
    refresh: refreshRents,
  } = useRentList();
  const {
    beds,
    loading: bedLoading,
    handleDelete: handleBedDelete,
  } = useBedList();

  function goHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goToBeds() {
    window.history.pushState({}, "", "/beds");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <button
            onClick={goHome}
            className="text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← На главную
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Аренды</h1>
        </header>

        {/* Кровати — только список, без формы добавления */}
        <section className="space-y-3">
          <BedList
            beds={beds}
            loading={bedLoading}
            onDelete={handleBedDelete}
          />
        </section>

        {/* Аренда */}
        <RentForm onSaved={refreshRents} />
        <RentList
          rents={rents}
          loading={rentLoading}
          onReturn={handleReturn}
          onDelete={handleRentDelete}
        />
      </div>
    </main>
  );
}
