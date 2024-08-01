import Layout from '../components/Layout';
import { Title } from '../components/Title';
import { useGameState } from '../hooks/useGameState';

export default function Lobby() {
  const { roomCode, leaveRoom } = useGameState();

  const leaveBtnHandler = () => {
    leaveRoom();
  };

  return (
    <Layout>
      <div className="relative flex flex-col items-center text-center">
        <Title text={"Room " + roomCode?.toString()} />
        <p className="opacity-50">
          Waiting for other player, share this code to your friend
        </p>
        <video className='max-w-80 my-4' src="/videos/mr-bean-waiting.mp4" controls={false} autoPlay loop muted  />
        <button className="w-1/3 disabled:bg-pink-700 font-medium px-4 py-2 bg-pink-500 hover:bg-cyan-500 rounded-md" onClick={leaveBtnHandler}>
          Leave
          </button>
      </div>
    </Layout>
  );
}
