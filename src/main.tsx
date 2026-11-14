import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Providers } from './app';
import { Home } from './pages/home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Home />
    </Providers>
  </StrictMode>,
);
