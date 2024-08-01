import { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';
import { GamePhase } from '../types/enums';
import { DataSnapshot, onValue, ref, remove, set } from 'firebase/database';
import { rtDb } from '../firebase/app';

interface IGameState {
  roomCode?: number;
  player: number;
  phase: GamePhase;
  turn: number;
  board: number[];
  setTurn: (turn: number) => Promise<any>;
  setBoard: (board: number[]) => Promise<any>;
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
  setBoard: async (board: number[]) => {},
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

  const listenToUpdates = useCallback((snapshot: DataSnapshot) => {
    const data = snapshot.val();
    console.log("Player", player);
    console.log("Data from snapshot", data);
    console.log("Board from state", board);

    // Update state based on data from snapshot
    _setBoard((prevBoard) => {
      console.log("Updating board from", prevBoard, "to", data.board);
      return data.board;
    });
    _setTurn((prevTurn) => {
      console.log("Updating turn from", prevTurn, "to", data.turn);
      return data.turn;
    });
    _setPhase((prevPhase) => {
      console.log("Updating phase from", prevPhase, "to", data.phase);
      return data.phase;
    });
  }, [player, board, turn]);

  async function setTurn(turn: number) {
    if (roomCode) {
      const roomRef = ref(rtDb, 'rooms/' + roomCode + '/turn');
      await set(roomRef, turn);
      _setTurn(turn);
    }
  };

  async function setBoard(newBoard: number[]) {
    if (roomCode) {
      const roomRef = ref(rtDb, 'rooms/' + roomCode + '/board');
      await set(roomRef, newBoard);
      _setBoard(newBoard);
    }
  };

  async function setPhase(phase: GamePhase) {
    if (roomCode) {
      const roomRef = ref(rtDb, 'rooms/' + roomCode + '/phase');
      await set(roomRef, phase);
      _setPhase(phase);
    }
  };

  async function createRoom() {
    _setPhase(GamePhase.CREATING_ROOM);
    const newRoomCode = Math.floor(100000 + Math.random() * 900000);
    try {
      const roomRef = ref(rtDb, 'rooms/' + newRoomCode);
      await set(roomRef, { phase: GamePhase.WAITING, turn, board });
      _setRoomCode(newRoomCode);
      setPlayer(1); // Set player to 1 here
      onValue(roomRef, listenToUpdates);
      _setPhase(GamePhase.WAITING);
    } catch (err) {
      console.error(err);
      _setPhase(GamePhase.CREATING_FAILED);
    }
  };

  async function joinRoomCode(code: number) {
    _setPhase(GamePhase.JOINING_ROOM);
    _setRoomCode(code);
    try {
      const roomRef = ref(rtDb, 'rooms/' + code);
      onValue(roomRef, async (snapshot) => {
        if (snapshot.exists()) {
          setPlayer(2); // Set player to 2 here
          _setPhase(GamePhase.PLAYING);
          await set(roomRef, { phase: GamePhase.PLAYING, turn, board });
          listenToUpdates(snapshot);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  async function leaveRoom() {
    if (roomCode) {
      await remove(ref(rtDb, 'rooms/' + roomCode));
      _setRoomCode(undefined);
      _setPhase(GamePhase.IDLE);
    }
  };

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
};

export const useGameState = () => useContext(GameStateContext);