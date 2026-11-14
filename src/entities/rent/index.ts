// Публичный API сущности Rent.
// Внешние слои импортируют только отсюда.

export type { Rent, RentStatus } from './model/types';
export { addRent, getRents, updateRent, deleteRent } from './model/api';
export { useIssueRent } from './model/useIssueRent';
export { useRentList } from './model/useRentList';
export { RentForm } from './ui/RentForm';
export { RentList } from './ui/RentList';
export { RentCard } from './ui/RentCard';
