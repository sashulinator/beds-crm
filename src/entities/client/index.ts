// Публичный API сущности Client.
// Внешние слои импортируют только отсюда.

export type { Client } from "./model/types";
export { addClient, getClients, updateClient, deleteClient } from "./model/api";
export { useAddClient } from "./model/useAddClient";
export { useClientList } from "./model/useClientList";
export { ClientForm } from "./ui/ClientForm";
export { ClientList } from "./ui/ClientList";
export { ClientCard } from "./ui/ClientCard";
