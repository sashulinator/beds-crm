// Страница «Редактировать клиента»: форма редактирования.

import { useEffect, useState } from "react";
import { ClientForm, getClients, type Client } from "../../../entities/client";

export function EditClientPage({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients().then((clients) => {
      setClient(clients.find((c) => c.id === clientId) ?? null);
      setLoading(false);
    });
  }, [clientId]);

  function goBack() {
    window.history.pushState({}, "", "/clients");
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

  if (!client) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Клиент не найден.</p>
          <button
            onClick={goBack}
            className="mt-4 text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            ← К клиентам
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
            ← К клиентам
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Редактировать клиента
          </h1>
        </header>

        <ClientForm client={client} onSaved={goBack} />
      </div>
    </main>
  );
}
