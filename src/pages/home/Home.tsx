// Страница «Главная»: композиция сущностей.
// Страница не содержит бизнес-логики — только раскладывает блоки по полочкам.

import { BedForm, BedList, useBedList } from '../../entities/bed';
import { RentForm, RentList, useRentList } from '../../entities/rent';

export function Home() {
  const { rents, loading: rentLoading, handleReturn, handleDelete: handleRentDelete, refresh: refreshRents } =
    useRentList();
  const { beds, loading: bedLoading, handleDelete: handleBedDelete, refresh: refreshBeds } = useBedList();

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Аренда товаров</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Данные хранятся локально в IndexedDB браузера. Фотографии товара снимаются перед выдачей.
          </p>
        </header>

        {/* Кровати */}
        <BedForm onSaved={refreshBeds} />
        <BedList beds={beds} loading={bedLoading} onDelete={handleBedDelete} />

        {/* Аренда */}
        <RentForm onSaved={refreshRents} />
        <RentList
          rents={rents}
          loading={rentLoading}
          onReturn={handleReturn}
          onDelete={handleRentDelete}
        />
      </div>
    </main>
  );
}
