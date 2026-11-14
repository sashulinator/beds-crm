// Хук «список клиентов»: загрузка, удаление.

import { useCallback, useEffect, useState } from "react";
import { deleteClient, getClients } from "./api";
import type { Client } from "./types";

export function useClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    setClients(await getClients());
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteClient(id);
      await refresh();
    },
    [refresh]
  );

  return { clients, loading, handleDelete, refresh };
}
