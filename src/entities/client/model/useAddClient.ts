// Хук «добавить клиента»: создаёт Client и пишет в IndexedDB.

import { useCallback, useState } from "react";
import { addClient } from "./api";
import type { Client } from "./types";

export function useAddClient(onSaved: () => void) {
  const [saving, setSaving] = useState(false);

  const add = useCallback(
    async (name: string, phone: string, note: string) => {
      setSaving(true);
      try {
        const client: Client = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          name: name.trim(),
          phone: phone.trim(),
          note: note.trim(),
        };
        await addClient(client);
        onSaved();
      } finally {
        setSaving(false);
      }
    },
    [onSaved]
  );

  return { add, saving };
}
