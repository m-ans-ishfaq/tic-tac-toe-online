import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { GamePhase } from '../types/enums';
import { DataSnapshot, onValue, ref, remove, set } from 'firebase/database';
import { rtDb } from '../firebase/app';
import { winningCombinations } from '../utils/tic-tac-toe';

interface IGameState {
  roomCode?: number;
  player: number;
  phase: GamePhase;
  turn: number;
  board: number[];
  setTurn: (turn: number) => Promise<any>;
  setBoard: (turn: number, board: number[]) => Promise<any>;
  setGamePhase: (phase: GamePhase) => Promise<any>;
  createRoom: () => Promise<any>;
  joinRoomCode: (code: number) => Promise<any>;
  leaveRoom: () => Promise<any>;
}

const GameStateContext = createContext<IGameState>({
  roomCode: undefined,
  player: 0,
  phase: GamePhase.IDLE,
  turn: 1,
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setTurn: async (turn: number) => {},
  setBoard: async (turn: number, board: number[]) => {},
  setGamePhase: async (phase: GamePhase) => {},
  createRoom: async () => {},
  joinRoomCode: async (code: number) => {},
  leaveRoom: async () => {},
});

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState(0);
  const [roomCode, _setRoomCode] = useState<undefined | number>(undefined);
  const [phase, _setPhase] = useState(GamePhase.IDLE);
  const [turn, _setTurn] = useState(1);
  const [board, _setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const roomRef = ref(rtDb, 'rooms/' + roomCode);

  const listenToUpdates = useCallback(
    (player: number, data: any) => {
      // if (data.updateBy == 2 && player == 1 && data.phase == GamePhase.PLAYING) {
      //   _setPhase(GamePhase.PLAYING);
      //   return;
      // }
      console.log('Data from snapshot by client ', data.updateBy, data);

      const { phase, updateBy, board, turn } = data;

      if (phase == GamePhase.WAITING) {
        return;
      }

      if (updateBy == 2 && player == 1) {
        _setBoard(board);
        _setTurn(turn);
        _setPhase(phase);
      } else if (updateBy == 1 && player == 2) {
        _setBoard(board);
        _setTurn(turn);
        _setPhase(phase);
      }

      // Checking for tie
      if (!board.includes(0)) {
        _setPhase(GamePhase.TIE);
        setPhase(GamePhase.TIE);
      }

      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === board[b] && board[a] === board[c] && board[a] !== 0) {
          if (board[a] == 1) {
            _setPhase(GamePhase.PLAYER_1_WIN);
            setPhase(GamePhase.PLAYER_1_WIN);
          } else {
            _setPhase(GamePhase.PLAYER_2_WIN);
            setPhase(GamePhase.PLAYER_2_WIN);
          }
        }
      }
    },
    [phase, player, board, turn]
  );

  async function setTurn(turn: number) {
    if (roomCode) {
      await set(roomRef, { phase, turn, board, updateBy: player });
      _setTurn(turn);
    }
  }

  async function setBoard(turn: number, newBoard: number[]) {
    if (roomCode) {
      await set(roomRef, { phase, turn, board: newBoard, updateBy: player });
      _setBoard(newBoard);
      _setTurn(turn);
    }
  }

  async function setPhase(phase: GamePhase) {
    if (roomCode) {
      await set(roomRef, { phase, turn, board, updateBy: player });
      _setPhase(phase);
    }
  }

  async function createRoom() {
    _setPhase(GamePhase.CREATING_ROOM);
    const newRoomCode = Math.floor(100000 + Math.random() * 900000);
    try {
      const roomRef = ref(rtDb, 'rooms/' + newRoomCode);
      await set(roomRef, {
        phase: GamePhase.WAITING,
        turn,
        board,
        updateBy: 1,
      });
      _setRoomCode(newRoomCode);
      setPlayer(1); // Set player to 1 here
      onValue(roomRef, (snapshot) => {
        listenToUpdates(1, snapshot.val());
      });
      _setPhase(GamePhase.WAITING);
    } catch (err) {
      console.error(err);
      _setPhase(GamePhase.CREATING_FAILED);
    }
  }

  async function joinRoomCode(code: number) {
    _setPhase(GamePhase.JOINING_ROOM);
    _setRoomCode(code);
    try {
      const roomRef = ref(rtDb, 'rooms/' + code);
      onValue(roomRef, async (snapshot) => {
        if (!snapshot.exists()) {
          _setPhase(GamePhase.ROOM_NOT_FOUND);
          return;
        }
        const data = snapshot.val();
        if (data.phase == GamePhase.WAITING) {
          setPlayer(2);
          _setPhase(GamePhase.PLAYING);
          await set(roomRef, {
            phase: GamePhase.PLAYING,
            turn,
            board,
            updateBy: 2,
          });
        }
        listenToUpdates(2, data);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function leaveRoom() {
    if (roomCode) {
      await remove(roomRef);
      _setRoomCode(undefined);
      _setPhase(GamePhase.IDLE);
    }
  }

  return (
    <GameStateContext.Provider
      value={{
        player,
        roomCode,
        phase,
        turn,
        board,
        setTurn,
        createRoom,
        setBoard,
        setGamePhase: setPhase,
        joinRoomCode,
        leaveRoom,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => useContext(GameStateContext);
