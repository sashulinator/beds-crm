// Страница «Главная»: композиция сущностей.
// Страница не содержит бизнес-логики — только раскладывает блоки по полочкам.

import { RentForm, RentList, useRentList } from '../../entities/rent';

export function Home() {
  const { rents, loading, handleReturn, handleDelete, refresh } = useRentList();

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Аренда товаров</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Данные хранятся локально в IndexedDB браузера. Фотографии товара снимаются перед выдачей.
          </p>
        </header>

        <RentForm onSaved={refresh} />
        <RentList rents={rents} loading={loading} onReturn={handleReturn} onDelete={handleDelete} />
      </div>
    </main>
  );
}
