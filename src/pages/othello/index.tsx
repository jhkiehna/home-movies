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

  React.useEffect(() => {
    if (!gameState) {
      createInitialState().then((gameState) => {
        setGameState(gameState);
      });
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

        {gameState ? <Info gameState={gameState} /> : null}

        {gameState ? <GameBoard gameState={gameState} setGameState={setGameState} /> : null}

        {gameState && Object.values(gameState.board).every((cell) => !!cell.occupiedBy) ? (
          <p>
            {Object.values(gameState.board).filter((cell) => cell.occupiedBy === 'white').length >
            Object.values(gameState.board).filter((cell) => cell.occupiedBy === 'black').length
              ? 'White'
              : 'Black'}{' '}
            Wins!!
          </p>
        ) : null}
      </main>
    </>
  );
};

export default Othello;
