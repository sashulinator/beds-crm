// Страница «Клиенты»: список.

import { ClientList, useClientList, type Client } from "../../entities/client";

export function ClientsPage() {
  const { clients, loading, handleDelete } = useClientList();

  function goBack() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function goToAddClient() {
    window.history.pushState({}, "", "/clients/add");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function handleEdit(client: Client) {
    window.history.pushState({}, "", `/clients/edit/${client.id}`);
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
            <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
            <button
              onClick={goToAddClient}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium transition hover:bg-indigo-500 active:scale-95"
            >
              + Добавить
            </button>
          </div>
        </header>

        <ClientList
          clients={clients}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
