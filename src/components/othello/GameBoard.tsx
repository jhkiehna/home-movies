import React from 'react';
import styles from '../../pages/index.module.css';

import { findCapturedTokenKeys, findAllPossibleMoves } from '../../utils/game';
import type { GameState } from '../../utils/game';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const GameBoard: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}> = ({ gameState, setGameState }) => {
  React.useEffect(() => {
    if (gameState.currentTurn !== gameState.playerColor) {
      const randomKey = gameState.possibleMoves[Math.floor(Math.random() * gameState.possibleMoves.length)] as string;

      if (!randomKey) return;

      setMove(randomKey);
    }
  }, [gameState.currentTurn]);

  const setMove = async (key: string) => {
    const board = { ...gameState.board, [key]: { occupiedBy: gameState.currentTurn } };

    setGameState({ ...gameState, board });

    await sleep(200);

    const tokens = findCapturedTokenKeys(key, gameState);

    for (const key of tokens) {
      board[key] = { occupiedBy: gameState.currentTurn };

      setGameState({ ...gameState, board });

      await sleep(100);
    }

    await sleep(500);

    let currentTurn: GameState['currentTurn'] = gameState.currentTurn === 'black' ? 'white' : 'black';

    let possibleMoves = findAllPossibleMoves(currentTurn, board);

    if (!possibleMoves.length) {
      possibleMoves = findAllPossibleMoves(gameState.currentTurn, board);
      currentTurn = currentTurn === 'black' ? 'white' : 'black';
    }

    setGameState({
      board,
      playerColor: gameState.playerColor,
      currentTurn,
      possibleMoves,
    });
  };

  const handleClick = (key: string) => {
    if (gameState.currentTurn === gameState.playerColor && gameState.possibleMoves.includes(key)) setMove(key);
  };

  return (
    <div className={styles.othelloboard}>
      {Array.from(Object.entries(gameState.board)).map(([key, cell]) => {
        const { x, y } = JSON.parse(key);

        return (
          <div
            key={key}
            className={`${styles.othelloboardcell} ${styles[`position-${x}-${y}`]}${
              gameState.possibleMoves.includes(key) ? ` ${styles.possibletokenmove}` : ''
            }`}
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
