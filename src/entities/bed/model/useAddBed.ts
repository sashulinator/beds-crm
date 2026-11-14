// Хук «добавить кровать»: конвертирует File → Blob, создаёт Bed и пишет в IndexedDB.

import { useCallback, useState } from 'react';
import { addBed } from './api';
import type { Bed, EngineColor } from './types';

export function useAddBed(onSaved: () => void) {
  const [saving, setSaving] = useState(false);

  const add = useCallback(
    async (title: string, number: string, engine: EngineColor, photo: File | null) => {
      setSaving(true);
      try {
        let photoBlob: Blob | null = null;
        if (photo) {
          const buf = await photo.arrayBuffer();
          photoBlob = new Blob([buf]);
        }

        const bed: Bed = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          title,
          number,
          engine,
          photo: photoBlob,
        };

        await addBed(bed);
        onSaved();
      } finally {
        setSaving(false);
      }
    },
    [onSaved],
  );

  return { add, saving };
}
