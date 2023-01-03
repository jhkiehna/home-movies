export type Token = 'white' | 'black';
export type GameCell = { occupiedBy?: Token };
export type GameBoard = { [key: string]: GameCell };
export type GameState = {
  board: GameBoard;
  currentTurn: 'white' | 'black';
  playerColor: 'white' | 'black';
  possibleMoves: string[];
};
