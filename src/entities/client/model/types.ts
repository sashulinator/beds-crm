// Сущность «Клиент»: человек, которому выдаём кровать в аренду.

export interface Client {
  id: string;
  /** Дата создания записи */
  createdAt: string; // ISO-строка
  /** Имя клиента */
  name: string;
  /** Телефон */
  phone: string;
  /** Примечание */
  note: string;
}
