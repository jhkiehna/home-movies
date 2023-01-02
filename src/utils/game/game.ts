import type { GameState, GameBoard, GameCell } from './types';

export function createInitialState() {
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

  return { board, currentTurn, playerColor, possibleMoves: findAllPossibleMoves(currentTurn, board) };
}

export function findAllPossibleMoves(currentTurn: GameState['currentTurn'], board: GameBoard): string[] {
  const possibleMoves: string[] = [];

  for (const key in board) {
    const cell = board[key];

    if (cell?.occupiedBy) continue;

    const { x, y } = JSON.parse(key);
    let tempX = x;
    let opponentPreviouslyFound: boolean;

    // Search up-leftwards
    tempX = x - 1;
    opponentPreviouslyFound = false;

    for (let yy = y - 1; yy > 0; yy--) {
      const thisKey = JSON.stringify({ x: tempX, y: yy });
      const thisCell = board[thisKey];
      tempX--;

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search Upwards
    opponentPreviouslyFound = false;

    for (let yy = y - 1; yy > 0; yy--) {
      const thisKey = JSON.stringify({ x, y: yy });
      const thisCell = board[thisKey];

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search up-rightwards
    tempX = x + 1;
    opponentPreviouslyFound = false;

    for (let yy = y - 1; yy > 0; yy--) {
      const thisKey = JSON.stringify({ x: tempX, y: yy });
      const thisCell = board[thisKey];
      tempX++;

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search Rightwards
    opponentPreviouslyFound = false;

    for (let xx = x + 1; xx <= 8; xx++) {
      const thisKey = JSON.stringify({ x: xx, y });
      const thisCell = board[thisKey];

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search down-rightwards
    tempX = x + 1;
    opponentPreviouslyFound = false;

    for (let yy = y + 1; yy <= 8; yy++) {
      const thisKey = JSON.stringify({ x: tempX, y: yy });
      const thisCell = board[thisKey];
      tempX++;

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search Downwards
    opponentPreviouslyFound = false;

    for (let yy = y + 1; yy <= 8; yy++) {
      const thisKey = JSON.stringify({ x, y: yy });
      const thisCell = board[thisKey];

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search down-leftwards
    tempX = x - 1;
    opponentPreviouslyFound = false;

    for (let yy = y + 1; yy <= 8; yy++) {
      const thisKey = JSON.stringify({ x: tempX, y: yy });
      const thisCell = board[thisKey];
      tempX--;

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;

    // Search Leftwards
    opponentPreviouslyFound = false;

    for (let xx = x - 1; xx > 0; xx--) {
      const thisKey = JSON.stringify({ x: xx, y });
      const thisCell = board[thisKey];

      if (!thisCell?.occupiedBy) break;
      if (!opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) break;

      if (thisCell.occupiedBy !== currentTurn) {
        opponentPreviouslyFound = true;
        continue;
      }
      if (opponentPreviouslyFound && thisCell.occupiedBy === currentTurn) {
        possibleMoves.push(key);
        break;
      }
    }

    if (possibleMoves.includes(key)) continue;
  }

  return possibleMoves;
}

export function findCapturedTokenKeys(key: string, state: GameState) {
  const currentTurn = state.currentTurn;
  const { x, y } = JSON.parse(key);
  let tempX = x;

  const capturedTokenKeys: string[] = [];

  // Search up-leftwards
  const potentialUpLeftTokens: string[] = [];
  tempX = x - 1;

  for (let yy = y - 1; yy > 0; yy--) {
    const thisKey = JSON.stringify({ x: tempX, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialUpLeftTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialUpLeftTokens);
      break;
    }

    tempX--;
  }

  // Search Upwards
  const potentialUpTokens: string[] = [];

  for (let yy = y - 1; yy > 0; yy--) {
    const thisKey = JSON.stringify({ x, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialUpTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialUpTokens);
      break;
    }
  }

  // Search up-rightwards
  const potentialUpRightTokens: string[] = [];
  tempX = x + 1;

  for (let yy = y - 1; yy > 0; yy--) {
    const thisKey = JSON.stringify({ x: tempX, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialUpRightTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialUpRightTokens);
      break;
    }
    tempX++;
  }

  // Search Rightwards
  const potentialRightTokens: string[] = [];

  for (let xx = x + 1; xx <= 8; xx++) {
    const thisKey = JSON.stringify({ x: xx, y });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialRightTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialRightTokens);
      break;
    }
  }

  // Search down-rightwards
  const potentialDownRightTokens: string[] = [];
  tempX = x + 1;

  for (let yy = y + 1; yy <= 8; yy++) {
    const thisKey = JSON.stringify({ x: tempX, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialDownRightTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialDownRightTokens);
      break;
    }

    tempX++;
  }

  // Search Down
  const potentialDownTokens: string[] = [];

  for (let yy = y + 1; yy <= 8; yy++) {
    const thisKey = JSON.stringify({ x, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialDownTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialDownTokens);
      break;
    }
  }

  // Search Down-leftwards
  const potentialDownLeftTokens: string[] = [];
  tempX = x - 1;

  for (let yy = y + 1; yy <= 8; yy++) {
    const thisKey = JSON.stringify({ x: tempX, y: yy });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialDownLeftTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialDownLeftTokens);
      break;
    }

    tempX--;
  }

  // Search Leftwards
  const potentialLeftTokens: string[] = [];

  for (let xx = x - 1; xx > 0; xx--) {
    const thisKey = JSON.stringify({ x: xx, y });
    const thisCell = state.board[thisKey];

    if (!thisCell?.occupiedBy) break;

    if (thisCell.occupiedBy !== currentTurn) potentialLeftTokens.push(thisKey);
    if (thisCell.occupiedBy === currentTurn) {
      capturedTokenKeys.push(...potentialLeftTokens);
      break;
    }
  }

  return capturedTokenKeys;
}
