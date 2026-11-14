// Сущность «Кровать»: базовая единица инвентаря.

export type EngineColor = 1 | 2 | 3;

export const ENGINE_COLORS: Record<EngineColor, string> = {
  1: 'Белый',
  2: 'Чёрный',
  3: 'Жёлтый',
};

export interface Bed {
  id: string;
  /** Дата создания записи */
  createdAt: string; // ISO-строка
  /** Название кровати */
  title: string;
  /** Номер кровати (буквы и цифры) */
  number: string;
  /** Двигатель: 1 — белый, 2 — чёрный, 3 — жёлтый */
  engine: EngineColor;
  /** Фотография (сфотать или загрузить) */
  photo: Blob | null;
}
