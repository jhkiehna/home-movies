import React from 'react';
import styles from '../../pages/index.module.css';

import { findCapturedTokenKeys, findAllPossibleMoves } from '../../utils/game';
import type { GameState } from '../../utils/game';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const GameBoard: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
}> = ({ gameState, setGameState }) => {
  const [boardLocked, setBoardLocked] = React.useState(false);

  React.useEffect(() => {
    if (boardLocked) return;

    if (gameState.currentTurn !== gameState.playerColor) {
      const randomKey = gameState.possibleMoves[Math.floor(Math.random() * gameState.possibleMoves.length)] as string;

      if (!randomKey) return;

      setMove(randomKey);
    }
  }, [gameState, boardLocked]);

  const setMove = async (key: string) => {
    setBoardLocked(true);
    const board = { ...gameState.board, [key]: { occupiedBy: gameState.currentTurn } };

    setGameState({ ...gameState, board });

    await sleep(200);

    const tokens = await findCapturedTokenKeys(key, gameState);

    for (const key of tokens) {
      board[key] = { occupiedBy: gameState.currentTurn };

      setGameState({ ...gameState, board });

      await sleep(100);
    }

    await sleep(500);

    let currentTurn: GameState['currentTurn'] = gameState.currentTurn === 'black' ? 'white' : 'black';

    let possibleMoves = await findAllPossibleMoves(currentTurn, board);

    if (!possibleMoves.length) {
      possibleMoves = await findAllPossibleMoves(gameState.currentTurn, board);
      currentTurn = currentTurn === 'black' ? 'white' : 'black';
    }

    setGameState({
      board,
      playerColor: gameState.playerColor,
      currentTurn,
      possibleMoves,
    });
    setBoardLocked(false);
  };

  const handleClick = (key: string) => {
    if (boardLocked) return;
    if (gameState.currentTurn !== gameState.playerColor) return;
    if (!gameState.possibleMoves.includes(key)) return;

    setMove(key);
  };

  return (
    <div className={styles.othelloboard}>
      {Array.from(Object.entries(gameState.board)).map(([key, cell]) => {
        const { x, y } = JSON.parse(key);

        const classNames = [styles.othelloboardcell, styles[`position-${x}-${y}`]];

        if (gameState.currentTurn === gameState.playerColor && gameState.possibleMoves.includes(key)) {
          classNames.push(styles.possibletokenmove);
        }

        return (
          <div
            key={key}
            className={classNames.join(' ')}
            {...(gameState.currentTurn === gameState.playerColor && { onClick: () => handleClick(key) })}
            style={{ gridColumn: x, gridRow: y }}
          >
            {cell?.occupiedBy && <div className={styles.token} style={{ backgroundColor: cell.occupiedBy }}></div>}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
