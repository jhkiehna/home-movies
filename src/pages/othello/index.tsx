import React from 'react';
import Head from 'next/head';
import { type NextPage } from 'next';

import styles from '../index.module.css';
import type { GameState } from '../../utils/game';
import { createInitialState } from '../../utils/game';
import GameBoard from '../../components/othello/GameBoard';
import Info from '../../components/othello/Info';

const Othello: NextPage = () => {
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [winningPlayer, setWinningPlayer] = React.useState<'white' | 'black' | null>(null);

  const whiteScore = Object.values(gameState?.board ?? {}).filter((cell) => cell.occupiedBy === 'white').length;
  const blackScore = Object.values(gameState?.board ?? {}).filter((cell) => cell.occupiedBy === 'black').length;

  React.useEffect(() => {
    // Initialize game board
    if (!gameState) {
      createInitialState().then((gameState) => {
        setGameState(gameState);
      });
      return;
    }

    const everyCellWhiteOrNull = Object.values(gameState.board).every(
      (cell) => cell.occupiedBy === 'white' || !cell.occupiedBy,
    );
    const everyCellBlackOrNull = Object.values(gameState.board).every(
      (cell) => cell.occupiedBy === 'black' || !cell.occupiedBy,
    );
    // Check end game conditions
    const boardFilled = Object.values(gameState.board).every((cell) => !!cell.occupiedBy);
    const noMorePossibleMoves = !gameState.possibleMoves.length && (everyCellBlackOrNull || everyCellWhiteOrNull);

    if (boardFilled || noMorePossibleMoves) {
      setIsGameOver(true);
      setWinningPlayer(everyCellWhiteOrNull ? 'white' : 'black');
    }
  }, [gameState]);

  return (
    <>
      <Head>
        <title>Othello</title>
        <meta name="description" content="Othello" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.othellomain}>
        <h1>Othello</h1>

        {gameState && (
          <Info
            playerColor={gameState.playerColor}
            currentTurn={gameState.currentTurn}
            whiteScore={whiteScore}
            blackScore={blackScore}
          />
        )}

        {gameState && <GameBoard gameState={gameState} setGameState={setGameState} />}

        {isGameOver && <p>{winningPlayer} Wins!!</p>}
      </main>
    </>
  );
};

export default Othello;
