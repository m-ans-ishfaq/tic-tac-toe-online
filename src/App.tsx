import { useGameState } from './hooks/useGameState';
import Game from './pages/Game';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import { GamePhase } from './types/enums';

export default function App() {
  const { roomCode, phase } = useGameState();

  if (!roomCode || phase == GamePhase.JOINING_FAILED || phase == GamePhase.JOINING_ROOM) {
    return <Home />;
  }

  if (phase == GamePhase.WAITING) {
    return <Lobby />
  }

  return (
    <Game />
  )
}
