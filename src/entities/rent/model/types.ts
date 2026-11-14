// Сущность аренды: что выдаём клиенту и в каком состоянии товар был на момент выдачи.

export type RentStatus = 'active' | 'returned';

export interface Rent {
  id: string;
  /** Название товара, который выдаём в аренду */
  itemTitle: string;
  /** Имя клиента, которому выдаём */
  clientName: string;
  /** Дата и время выдачи */
  issuedAt: string; // ISO-строка
  /**
   * Фотографии товара, снятые ПЕРЕД выдачей.
   * Храним как Blob — IndexedDB поддерживает бинарные данные нативно,
   * это эффективнее, чем base64-строки.
   */
  photos: Blob[];
  status: RentStatus;
}
