// Глобальные провайдеры приложения (темы, контексты, роутер).
// Пока приложение одностраничное — провайдеров нет, но слои уже на месте.

import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
