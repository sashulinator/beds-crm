// Хук «список аренд»: загрузка, возврат, удаление.

import { useCallback, useEffect, useState } from 'react';
import { deleteRent, getRents, updateRent, type Rent } from './api';

export function useRentList() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем список из IndexedDB при монтировании.
  useEffect(() => {
    getRents()
      .then(setRents)
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    setRents(await getRents());
  }, []);

  const handleReturn = useCallback(
    async (id: string) => {
      const rent = rents.find((r) => r.id === id);
      if (!rent) return;
      await updateRent({ ...rent, status: 'returned' });
      await refresh();
    },
    [rents, refresh],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteRent(id);
      await refresh();
    },
    [refresh],
  );

  return { rents, loading, handleReturn, handleDelete, refresh };
}
