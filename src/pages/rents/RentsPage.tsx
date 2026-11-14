// Страница «Аренда»: список аренд.

import { RentList, useRentList, type Rent } from "../../entities/rent";

export function RentsPage() {
  const {
    rents,
    loading: rentLoading,
    handleReturn,
    handleDelete: handleRentDelete,
  } = useRentList();

  function goHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goToAddRent() {
    window.history.pushState({}, "", "/rents/add");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goToArchive() {
    window.history.pushState({}, "", "/rents/archive");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function handleEdit(rent: Rent) {
    window.history.pushState({}, "", `/rents/edit/${rent.id}`);
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
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Аренды</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={goToArchive}
                className="rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-medium transition hover:bg-gray-500 active:scale-95"
              >
                Архив
              </button>
              <button
                onClick={goToAddRent}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95"
              >
                + Выдать в аренду
              </button>
            </div>
          </div>
        </header>

        <RentList
          rents={rents}
          loading={rentLoading}
          onReturn={handleReturn}
          onDelete={handleRentDelete}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
