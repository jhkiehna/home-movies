import type { GameState } from '../../utils/game';

const Info: React.FC<{
  playerColor: GameState['playerColor'];
  currentTurn: GameState['currentTurn'];
  whiteScore: number;
  blackScore: number;
}> = ({ playerColor, currentTurn, whiteScore, blackScore }) => {
  return (
    <p style={{ textAlign: 'center' }}>
      Playing as: {playerColor}
      <br />
      <br />
      Score:
      <br />
      White: {whiteScore} - Black: {blackScore}
      <br />
      <br />
      Current turn: {currentTurn}
    </p>
  );
};

export default Info;
