import { createContext, ReactNode, useContext, useState } from 'react';
import { GamePhase, RoomCodeJoinState as RoomJoinResult } from '../types/enums';

interface IGameState {
  roomCode?: number;
  phase: GamePhase;
  turn: number;
  board: number[];
  setTurn: (turn: number) => any;
  setBoard: (board: number[]) => any;
  setPhase: (phase: GamePhase) => any;
  createRoom: () => number;
  joinRoomCode: (code: number) => RoomJoinResult;
}

const GameStateContext = createContext<IGameState>({
  roomCode: undefined,
  phase: GamePhase.IDLE,
  turn: 1,
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setTurn: (turn: number) => {},
  setBoard: (board: number[]) => {},
  setPhase: (phase: GamePhase) => {},
  createRoom: () => 0,
  joinRoomCode: (code: number) => RoomJoinResult.NOT_FOUND,
});

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [roomCode, _setRoomCode] = useState<undefined | number>(undefined);
  const [phase, _setPhase] = useState(GamePhase.IDLE);
  const [turn, _setTurn] = useState(1);
  const [board, _setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const setTurn = (turn: number) => {
    _setTurn(turn);
  };

  const createRoom = () => {
    const roomCode = Math.floor(100000 + Math.random() * 900000);
    _setRoomCode(roomCode);
    return roomCode;
  };

  const joinRoomCode = (code: number) => {
    _setRoomCode(code);
    return RoomJoinResult.SUCCESS;
  };

  const setPhase = (phase: GamePhase) => {
    _setPhase(phase);
  };

  const setBoard = (board: number[]) => {
    _setBoard(board);
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
        setPhase,
        joinRoomCode,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
