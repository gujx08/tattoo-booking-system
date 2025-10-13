import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGA } from './utils/analytics';

// 初始化Google Analytics 4
initGA();

createRoot(document.getElementById('root')!).render(
  <App />
);