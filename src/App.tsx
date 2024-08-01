import { useGameState } from './hooks/useGameState';
import Home from './pages/Home';

export default function App() {
  const { roomCode } = useGameState();

  if (!roomCode) {
    return <Home />;
  }
}
