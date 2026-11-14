// Публичный API сущности Bed.
// Внешние слои импортируют только отсюда.

export type { Bed, EngineColor } from './model/types';
export { ENGINE_COLORS } from './model/types';
export { addBed, getBeds, deleteBed } from './model/api';
export { useAddBed } from './model/useAddBed';
export { useBedList } from './model/useBedList';
export { BedForm } from './ui/BedForm';
export { BedList } from './ui/BedList';
export { BedCard } from './ui/BedCard';
