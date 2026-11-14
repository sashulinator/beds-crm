import { useEffect, useState } from 'react';
import RentForm from './components/RentForm';
import RentList from './components/RentList';
import { addRent, deleteRent, getRents, updateRent } from './db';
import type { Rent } from './types';

function App() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем список из IndexedDB при монтировании.
  useEffect(() => {
    getRents()
      .then(setRents)
      .finally(() => setLoading(false));
  }, []);

  /** Обработчик формы: конвертирует File[] → Blob[] и пишет в IndexedDB. */
  async function handleIssue(itemTitle: string, clientName: string, photos: File[]) {
    const photoBlobs = await Promise.all(
      photos.map((file) => file.arrayBuffer().then((buf) => new Blob([buf]))),
    );

    const rent: Rent = {
      id: crypto.randomUUID(),
      itemTitle,
      clientName,
      issuedAt: new Date().toISOString(),
      photos: photoBlobs,
      status: 'active',
    };

    await addRent(rent);
    setRents(await getRents());
  }

  async function handleReturn(id: string) {
    const rent = rents.find((r) => r.id === id);
    if (!rent) return;
    await updateRent({ ...rent, status: 'returned' });
    setRents(await getRents());
  }

  async function handleDelete(id: string) {
    await deleteRent(id);
    setRents(await getRents());
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Аренда товаров</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Данные хранятся локально в IndexedDB браузера. Фотографии товара снимаются перед выдачей.
          </p>
        </header>

        <RentForm onSubmit={handleIssue} />
        <RentList rents={rents} loading={loading} onReturn={handleReturn} onDelete={handleDelete} />
      </div>
    </main>
  );
}

export default App;
