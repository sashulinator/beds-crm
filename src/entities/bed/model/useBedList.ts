// Хук «список кроватей»: загрузка и удаление.

import { useCallback, useEffect, useState } from 'react';
import { deleteBed, getBeds } from './api';
import type { Bed } from './types';

export function useBedList() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBeds()
      .then(setBeds)
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    setBeds(await getBeds());
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteBed(id);
      await refresh();
    },
    [refresh],
  );

  return { beds, loading, handleDelete, refresh };
}
