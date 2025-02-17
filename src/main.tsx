import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GameStateProvider } from './hooks/useGameState.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <GameStateProvider>
    <App />
  </GameStateProvider>
  // </React.StrictMode>
);
