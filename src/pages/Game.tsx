import Layout from "../components/Layout";
import { Title } from "../components/Title";
import { useGameState } from "../hooks/useGameState";

export default function Game() {

    const { board, turn, player, setBoard, setTurn } = useGameState();

    const BoardCell = ({ cell, index }: { cell: number, index: number }) => {
        
        let cellBody = <></>;
        switch (cell)
        {
            case 1:
                cellBody = <img src="/images/check.png" alt="" className="w-full relative z-0" />;
                break;
            case 2:
                cellBody = <img src="/images/cross.png" alt="" className="w-full relative z-0" />;
                break;
        }

        const handleCellClick = () => {
            console.log("Player while clicking", player);
            let newBoard = [...board];
            newBoard[index] = player;
            // setTurn(turn == 1 ? 2 : 1);
            console.log("Board after clicking", newBoard);
            setBoard(newBoard);
        }

        return (
            <button disabled={player !== turn} onClick={handleCellClick} className="p-4">
                {cellBody}
            </button>
        )
    }

    return (
        <Layout>
            <Title text="Tic Tac Toe" />
            <div className="mb-8">
                <p className="opacity-60">Player {turn} Turn: {turn == 1 ? 'Check': 'Cross'}</p>
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