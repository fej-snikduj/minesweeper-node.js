'use strict';
const Board = require('./Board.js').Board;

class MineBoard extends Board {
  constructor(size, difficulty) {
    super(size);
    this.difficulty = difficulty || '1';
    this.bomb = String.fromCharCode(9762);
    this.numberOfMines = this.determineNumberOfMines();
    this.mineBoard = this.placeMinesOnBoard();

  }

  determineNumberOfMines() {
    let { difficulty, totalNumOfSquares } = this;
    switch(difficulty) {
      case '1':
        return Math.floor(totalNumOfSquares * 0.075);
        break;
      case '2':
        return Math.floor(totalNumOfSquares * 0.1);
        break;
      case '3':
        return Math.floor(totalNumOfSquares * 0.125);
    }
  };

  placeMinesOnBoard() {
    let { size, numberOfMines } = this;
    let board= this.generateEmptyBoard();

    // Generate random mine placement
    for (let i = 0; i < numberOfMines; i++) {
      let row = Math.floor(Math.random() * size);
      let column = Math.floor(Math.random() * size);
      // If no mine at indices, place mine
      if (board[row][column] === 0) {
        board[row][column] = this.bomb;
      } else {
        i--;
      }
    }
    //Generate proximity numbers
    this.determineMineProximityNumbers(board);

    return board;
  }

  determineMineProximityNumbers(board) {
    let { size } = this;

    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {

        // Skip over mines
        if (board[row][column] === this.bomb) {
          continue;
        }

        // Keep track of number of bombs adjacent to current indices
        let numOfBombsInVicinity = 0;

        // Iterate over 8 surround squares
        this.relationalIndicesMap.forEach(relIndex => {
          let rowToCheck = row + relIndex.row;
          let colToCheck = column + relIndex.col;
          if (!this.isInBounds(rowToCheck, colToCheck)) return;
          if (board[rowToCheck][colToCheck] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }, this);

        // Label square with result
        board[row][column] = numOfBombsInVicinity;
      }
    }
  }
}

module.exports = {
  MineBoard,
};
