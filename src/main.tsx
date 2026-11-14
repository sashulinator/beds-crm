import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './index.css';
import { Providers } from './app';
import { Home } from './pages/home';
import { RentsPage } from './pages/rents';
import { BedsPage } from './pages/beds';
import { DataTransferPage } from './pages/data-transfer';

// Простой SPA-роутинг на основе pathname.
let root: Root | null = null;

function render() {
  const path = window.location.pathname;

  let page;
  if (path === '/rents') {
    page = <RentsPage />;
  } else if (path === '/beds') {
    page = <BedsPage />;
  } else if (path === '/data-transfer') {
    page = <DataTransferPage />;
  } else {
    page = <Home />;
  }

  if (!root) {
    root = createRoot(document.getElementById('root')!);
  }

  root.render(
    <StrictMode>
      <Providers>{page}</Providers>
    </StrictMode>,
  );
}

render();

// Перерисовка при навигации (pushState / popstate).
window.addEventListener('popstate', render);
