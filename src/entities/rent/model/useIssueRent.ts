// Хук «выдать в аренду»: конвертирует File[] → Blob[], создаёт Rent и пишет в IndexedDB.

import { useCallback, useState } from 'react';
import { addRent } from './api';
import type { Rent } from './types';

export function useIssueRent(onSaved: () => void) {
  const [saving, setSaving] = useState(false);

  const issue = useCallback(
    async (bedId: string, clientName: string, photos: File[]) => {
      setSaving(true);
      try {
        const photoBlobs = await Promise.all(
          photos.map((file) => file.arrayBuffer().then((buf) => new Blob([buf]))),
        );

        const rent: Rent = {
          id: crypto.randomUUID(),
          bedId,
          clientName,
          issuedAt: new Date().toISOString(),
          photos: photoBlobs,
          status: 'active',
        };

        await addRent(rent);
        onSaved();
      } finally {
        setSaving(false);
      }
    },
    [onSaved],
  );

  return { issue, saving };
}
