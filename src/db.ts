// Обёртка над IndexedDB для сущности Rent.
//
// Как это работает:
// 1. indexedDB.open() возвращёт IDBOpenDBRequest — асинхронное открытие базы.
// 2. В onupgradeneeded создаём object store (таблицу) и индексы.
// 3. Каждая операция (add/get/delete) идёт через transaction — она атомарна.
// 4. Записываем данные через store.put()/store.get() и ждём onsuccess.

import type { Rent } from './types';

const DB_NAME = 'beds';
const DB_VERSION = 1;
const STORE_NAME = 'rents';

let dbPromise: Promise<IDBDatabase> | null = null;

/** Ленивое открытие базы: вызывается один раз, результат кэшируется. */
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // При первом открытии (или смене версии) создаём схему.
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // keyPath: 'id' — первичный ключ записи.
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Индекс по status позволяет быстро искать все активные аренды.
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/** Добавляет запись об аренде в базу. */
export async function addRent(rent: Rent): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(rent);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Возвращает все аренды (в порядке добавления). */
export async function getRents(): Promise<Rent[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as Rent[]);
    request.onerror = () => reject(request.error);
  });
}

/** Обновляет запись (например, смену status на 'returned'). */
export async function updateRent(rent: Rent): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(rent);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Удаляет запись по id. */
export async function deleteRent(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
