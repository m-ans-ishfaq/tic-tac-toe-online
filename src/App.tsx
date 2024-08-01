import { useGameState } from './hooks/useGameState';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import { GamePhase } from './types/enums';

export default function App() {
  const { roomCode, phase } = useGameState();

  if (!roomCode) {
    return <Home />;
  }

  if (phase == GamePhase.WAITING) {
    return <Lobby />
  }
}
