import { popAudio } from "../components/assets";
import Layout from "../components/Layout";
import { Title } from "../components/Title";
import { useGameState } from "../hooks/useGameState";
import { GamePhase } from "../types/enums";

export default function Game() {

    const { phase, board, turn, player, setBoard } = useGameState();

    const BoardCell = ({ cell, index }: { cell: number, index: number }) => {

        let cellBody = <></>;
        switch (cell) {
            case 1:
                cellBody = <img src="/images/check.png" alt="" className="w-full relative z-0" />;
                break;
            case 2:
                cellBody = <img src="/images/cross.png" alt="" className="w-full relative z-0" />;
                break;
        }

        const handleCellClick = () => {
            let newBoard = [...board];
            newBoard[index] = player;
            popAudio.play();
            setBoard(turn == 1 ? 2 : 1, newBoard);
        }

        let disableBtn = player === turn ? (board[index] !== 0) : true;

        if (phase == GamePhase.TIE || phase == GamePhase.PLAYER_1_WIN || phase == GamePhase.PLAYER_2_WIN) {
            disableBtn = true;
        }

        return (
            <button disabled={disableBtn} onClick={handleCellClick} className="p-4">
                {cellBody}
            </button>
        )
    }

    let gameState;

    switch (phase) {
        case GamePhase.TIE:
            gameState = 'Tie';
            break;
        case GamePhase.PLAYER_1_WIN:
            gameState = 'Player 1 Wins';
            break;
        case GamePhase.PLAYER_2_WIN:
            gameState = 'Player 2 Wins';
            break;
        default:
            gameState = 'Playing';
    }

    return (
        <Layout>
            <Title text="Tic Tac Toe" />
            <div className="mb-8">
                <p className="opacity-60">({gameState}) Player {turn} Turn: {turn == 1 ? 'Check' : 'Cross'}</p>
            </div>
            <div className="relative w-full max-w-80">
                <img src="/images/grid.png" alt="" className="w-full relative z-0" />
                <div className="absolute z-10 top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 gap-[6.4453125%]">
                    {board.map((cell, index) => (
                        <BoardCell key={index} {...{ cell, index }} />
                    ))}
                </div>
            </div>
        </Layout>
    )
}