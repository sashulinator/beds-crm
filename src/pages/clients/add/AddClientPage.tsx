// Страница «Добавить клиента»: форма добавления.

import { ClientForm } from "../../../entities/client";

export function AddClientPage() {
  function goBack() {
    window.history.pushState({}, "", "/clients");
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
            ← К клиентам
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Добавить клиента
          </h1>
        </header>

        <ClientForm onSaved={goBack} />
      </div>
    </main>
  );
}
