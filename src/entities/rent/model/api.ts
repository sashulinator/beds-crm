// Обёртка над IndexedDB для сущности Rent.

import { openDB } from '../../../shared/lib';
import type { Rent } from './types';

const STORE_NAME = 'rents';

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
