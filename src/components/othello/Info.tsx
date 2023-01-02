import type { GameState } from '../../utils/game';

const Info: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const whiteScore = Object.values(gameState.board).filter((cell) => cell.occupiedBy === 'white').length;
  const blackScore = Object.values(gameState.board).filter((cell) => cell.occupiedBy === 'black').length;

  return (
    <p style={{ textAlign: 'center' }}>
      Current turn: {gameState.currentTurn}
      <br />
      <br />
      Score:
      <br />
      White: {whiteScore} - Black: {blackScore}
      <br />
      <br />
      Playing as: {gameState.playerColor}
    </p>
  );
};

export default Info;
