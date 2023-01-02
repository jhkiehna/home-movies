import type { GameState, GameBoard, GameCell } from './types';

export async function createInitialState() {
  const currentTurn: GameState['currentTurn'] = Math.random() > 0.5 ? 'black' : 'white';
  const playerColor: GameState['playerColor'] = currentTurn === 'black' ? 'white' : 'black';

  const board: GameBoard = {};

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y <= 8; y++) {
      const cellState: GameCell = {};
      const key = JSON.stringify({ x, y });

      if (x === 4 && y === 4) cellState.occupiedBy = 'white';
      if (x === 5 && y === 5) cellState.occupiedBy = 'white';
      if (x === 4 && y === 5) cellState.occupiedBy = 'black';
      if (x === 5 && y === 4) cellState.occupiedBy = 'black';

      board[key] = cellState;
    }
  }

  return { board, currentTurn, playerColor, possibleMoves: await findAllPossibleMoves(currentTurn, board) };
}

export async function findAllPossibleMoves(currentTurn: GameState['currentTurn'], board: GameBoard): Promise<string[]> {
  const possibleMoves: string[] = [];

  for (const key in board) {
    const cell = board[key];

    if (cell?.occupiedBy) continue;

    const { x, y } = JSON.parse(key);

    // Search all directions from this location to see if this cell is a possible move for the current player
    const directionModifiers: [number, number][] = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ];

    const result = await Promise.any(
      directionModifiers.map(
        ([xModifier, yModifier]): Promise<boolean> =>
          new Promise((res, rej) => {
            if (searchCapturableTokens(board, currentTurn, x, y, xModifier, yModifier).length) res(true);
            rej(false);
          }),
      ),
    ).catch((error) => {
      if (!(error instanceof AggregateError)) console.error(error);
      return false;
    });

    if (result) possibleMoves.push(key);
  }

  return possibleMoves;
}

export async function findCapturedTokenKeys(key: string, state: GameState) {
  const { currentTurn, board } = state;
  const { x, y } = JSON.parse(key);

  // Search all directions from this location to get the captured tokens by the player's move
  const directionModifiers: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ];

  return (
    await Promise.all(
      directionModifiers.map(async ([xModifier, yModifier]) =>
        searchCapturableTokens(board, currentTurn, x, y, xModifier, yModifier),
      ),
    )
  ).flat();
}

function searchCapturableTokens(
  board: GameBoard,
  currentTurn: GameState['currentTurn'],
  x: number,
  y: number,
  xModifier: number,
  yModifier: number,
) {
  const tokensCaptured: string[] = [];
  x += xModifier;
  y += yModifier;

  while (x > 0 && y > 0 && x <= 8 && y <= 8) {
    const thisKey = JSON.stringify({ x, y });
    const thisCell = board[thisKey];

    if (!thisCell?.occupiedBy || (!tokensCaptured.length && thisCell.occupiedBy === currentTurn)) return [];
    if (tokensCaptured.length && thisCell.occupiedBy === currentTurn) return tokensCaptured;

    if (thisCell.occupiedBy !== currentTurn) tokensCaptured.push(thisKey);

    y += yModifier;
    x += xModifier;
  }

  return [];
}
