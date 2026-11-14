// Страница «Экспорт / Импорт данных».

import { DataTransferPanel } from '../../features/data-transfer';

export function DataTransferPage() {
  function goBack() {
    window.history.pushState({}, '', '/rents');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <button
            onClick={goBack}
            className="text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← К арендам
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Экспорт / Импорт данных</h1>
        </header>

        <DataTransferPanel
          onImported={() => {
            // Данные заменены — возвращаемся на страницу аренд, где списки обновятся.
            goBack();
          }}
        />
      </div>
    </main>
  );
}
