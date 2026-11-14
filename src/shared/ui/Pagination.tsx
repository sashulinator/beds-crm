// Общий компонент пагинации: «Назад / Вперёд» и индикатор страницы.

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Пагинация списков: кнопки «Назад» и «Вперёд», индикатор «Стр. X из Y». */
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-600 active:scale-95 disabled:opacity-50"
      >
        ← Назад
      </button>
      <span className="text-sm text-neutral-400">
        Стр. {page} из {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-600 active:scale-95 disabled:opacity-50"
      >
        Вперёд →
      </button>
    </div>
  );
}
