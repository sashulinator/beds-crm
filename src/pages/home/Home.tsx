// Страница «Главная»: карточка со статистикой аренд и ссылка на список.

import { RentStats, useRentList } from '../../entities/rent';

export function Home() {
  const { rents, loading } = useRentList();

  function goToRents() {
    window.history.pushState({}, '', '/rents');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Аренда товаров</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Данные хранятся локально в IndexedDB браузера.
          </p>
        </header>

        {/* Карточка с количеством аренд */}
        <RentStats rents={rents} loading={loading} />

        {/* Ссылка на список */}
        <button
          onClick={goToRents}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95"
        >
          Перейти к списку аренд →
        </button>
      </div>
    </main>
  );
}
