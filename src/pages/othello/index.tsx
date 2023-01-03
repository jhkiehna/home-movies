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
  const [winningPlayer, setWinningPlayer] = React.useState<'White' | 'Black' | 'No One' | null>(null);
  const [blackScore, setBlackScore] = React.useState(0);
  const [whiteScore, setWhiteScore] = React.useState(0);

  React.useEffect(() => {
    // Initialize game board
    if (!gameState) {
      createInitialState().then((gameState) => {
        setGameState(gameState);
      });
      return;
    }

    setWhiteScore(Object.values(gameState?.board ?? {}).filter((cell) => cell.occupiedBy === 'white').length);
    setBlackScore(Object.values(gameState?.board ?? {}).filter((cell) => cell.occupiedBy === 'black').length);

    // Check end game conditions
    const everyCellWhiteOrNull = Object.values(gameState.board).every(
      (cell) => cell.occupiedBy === 'white' || !cell.occupiedBy,
    );
    const everyCellBlackOrNull = Object.values(gameState.board).every(
      (cell) => cell.occupiedBy === 'black' || !cell.occupiedBy,
    );
    const boardFilled = Object.values(gameState.board).every((cell) => !!cell.occupiedBy);
    const noMorePossibleMoves = !gameState.possibleMoves.length && (everyCellBlackOrNull || everyCellWhiteOrNull);

    if (boardFilled || noMorePossibleMoves) {
      setIsGameOver(true);

      if (everyCellWhiteOrNull) return setWinningPlayer('White');
      if (everyCellBlackOrNull) return setWinningPlayer('Black');

      setWinningPlayer(whiteScore === blackScore ? 'No One' : whiteScore > blackScore ? 'White' : 'Black');
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
