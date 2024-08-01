import { createContext, ReactNode, useContext, useState } from 'react';
import { GamePhase, RoomCodeJoinState as RoomJoinResult } from '../types/enums';
import { ref, set } from 'firebase/database';
import { rtDb } from '../firebase/app';

interface IGameState {
  roomCode?: number;
  phase: GamePhase;
  turn: number;
  board: number[];
  setTurn: (turn: number) => Promise<any>;
  setBoard: (board: number[]) => Promise<any>;
  setGamePhase: (phase: GamePhase) => Promise<any>;
  createRoom: () => Promise<number | undefined>;
  joinRoomCode: (code: number) => Promise<RoomJoinResult>;
  leaveRoom: () => Promise<any>;
}

const GameStateContext = createContext<IGameState>({
  roomCode: undefined,
  phase: GamePhase.IDLE,
  turn: 1,
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setTurn: async (turn: number) => {},
  setBoard: async (board: number[]) => {},
  setGamePhase: async (phase: GamePhase) => {},
  createRoom: async () => 0,
  joinRoomCode: async (code: number) => RoomJoinResult.NOT_FOUND,
  leaveRoom: async () => {},
});

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [roomCode, _setRoomCode] = useState<undefined | number>(undefined);
  const [phase, _setPhase] = useState(GamePhase.IDLE);
  const [turn, _setTurn] = useState(1);
  const [board, _setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const setTurn = async (turn: number) => {
    _setTurn(turn);
  };

  const createRoom = async () => {
    _setPhase(GamePhase.CREATING_ROOM);
    const roomCode = Math.floor(100000 + Math.random() * 900000);
    try {
      await set(ref(rtDb, 'rooms/' + roomCode), { phase, turn, board });
      _setRoomCode(roomCode);
      setPhase(GamePhase.WAITING);
      return roomCode;
    } catch (err) {
      console.error(err);
      setPhase(GamePhase.CREATING_FAILED);
    }
  };

  const joinRoomCode = async (code: number) => {
    _setPhase(GamePhase.JOINING_ROOM);
    _setRoomCode(code);
    return RoomJoinResult.SUCCESS;
  };

  const setPhase = async (phase: GamePhase) => {
    _setPhase(phase);
  };

  const setBoard = async (board: number[]) => {
    _setBoard(board);
  };

  const leaveRoom = async () => {
    _setRoomCode(undefined);
    _setPhase(GamePhase.IDLE);
  };

  return (
    <GameStateContext.Provider
      value={{
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
