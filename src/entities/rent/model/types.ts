// Сущность аренды: выдаём кровать клиенту.

export type RentStatus = 'active' | 'returned';

export interface Rent {
  id: string;
  /** Ссылка на кровать, которую выдаём */
  bedId: string;
  /** Имя клиента, которому выдаём */
  clientName: string;
  /** Дата и время выдачи */
  issuedAt: string; // ISO-строка
  /**
   * Фотографии кровати, снятые ПЕРЕД выдачей.
   * Храним как Blob — IndexedDB поддерживает бинарные данные нативно.
   */
  photos: Blob[];
  status: RentStatus;
}
