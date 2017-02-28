'use strict';

class Board {
  constructor(size) {
    // This map allows for easy iteration of all squares surrounding each square
    this.size = size || 20;
    this.totalNumOfSquares = this.size * this.size;
    this.relationalIndicesMap = [
      {row: -1, col: -1},
      {row: -1, col: 0},
      {row: -1, col: 1},
      {row: 0, col: -1},
      {row: 0, col: 1},
      {row: 1, col: -1},
      {row: 1, col: 0},
      {row: 1, col: 1},
    ];
  }

  generateEmptyBoard() {
    let { size } = this;
    let board= [];
    // Create board of zeros
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

  isInBounds(row, col) {
    let rowInBounds = row >= 0 && row < this.size ? true : false;
    let colInBounds = col >= 0 && col < this.size ? true : false;
    return rowInBounds && colInBounds;
  }
}

module.exports = {
  Board,
};
