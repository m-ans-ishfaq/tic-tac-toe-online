import { useState } from 'react';
import Layout from '../components/Layout';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../types/enums';
import { Title } from '../components/Title';

export default function Home() {

  const [roomCode, setRoomCode] = useState<string>('');
  const { createRoom, joinRoomCode, phase, setPhase } = useGameState();

  let createRoomLabel = 'Create new room', joinRoomLabel = 'Join Room';
  switch (phase)
  {
    case GamePhase.CREATING_ROOM:
      createRoomLabel = 'Creating room...';
      break;
    case GamePhase.CREATING_FAILED:
      createRoomLabel = "Failed !";
      setTimeout(() => {
        createRoomLabel = 'Create new room'
      }, 2500);
      break;
    case GamePhase.JOINING_ROOM:
      joinRoomLabel = 'Joining room...';
      break;
    case GamePhase.JOINING_FAILED:
      joinRoomLabel = 'Joining failed !';
      break;
  }
  
  const createRoomHandler = () => {
    createRoom();
    setPhase(GamePhase.CREATING_ROOM);
  }

  const joinRoomHandler = () => {
    joinRoomCode(parseInt(roomCode));
    setPhase(GamePhase.JOINING_ROOM);
  }

  return (
    <Layout>
      <Title text="Tic Tac Toe Online" />
      <img src="/images/tic-tac-toe.png" alt="Tic Tac Toe" className="w-80" />
      <div className="max-w-lg w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={createRoomHandler}
          disabled={phase !== GamePhase.IDLE}
          className="disabled:bg-pink-700 font-medium px-4 py-2 bg-pink-500 hover:bg-cyan-500 rounded-md"
        >
          {createRoomLabel}
        </button>
        <div className="flex sm:col-span-2">
          <input
            required
            title="6 Digit Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
            pattern="\d{6}"
            className="input-focused focus:ring-cyan-500 focus:bg-zinc-800 w-full bg-zinc-900 border-none outline-none ring-pink-500 ring-2 rounded-l-md px-4 py-2"
          />
          <button
            onClick={joinRoomHandler}
            disabled={phase !== GamePhase.IDLE}
            className="font-medium w-full px-4 py-2 ring-2 join-button bg-pink-500 disabled:brightness-75 ring-pink-500 rounded-r-md"
          >
            {joinRoomLabel}
          </button>
        </div>
      </div>
    </Layout>
  );
}
