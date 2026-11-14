// Публичный API фичи data-transfer.
// Экспорт/импорт всех данных приложения в бинарный формат .beds.

export { DataTransferPanel } from './ui/DataTransferPanel';
export { useDataTransfer } from './model/useDataTransfer';
export { serializeAll, deserializeAll } from './model/serializer';
export type { DeserializedData } from './model/serializer';
