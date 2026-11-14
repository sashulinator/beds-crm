// Единая точка доступа к IndexedDB для всего приложения.
// База 'beds' содержит несколько object stores (rents, beds).
// Версия базы увеличивается при добавлении нового store.

const DB_NAME = 'beds';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('rents')) {
        const store = db.createObjectStore('rents', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('beds')) {
        const store = db.createObjectStore('beds', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}
