class MineBoard {
  constructor(size, difficulty) {
    this.size = size || 10;
    this.difficulty = difficulty || 1;
    this.totalNumOfSquares = size ** 2;
    this.numberOfMines = this.determineNumberOfMines();
    this.board = this.generateNewBoard(); //requires number of mines to be set
    this.uncoveredCount = 0;
    this.winningUncoveredCount = this.totalNumOfSquares - this.numberOfMines;
    this.viewBoard = this.generateNewViewBoard();
    this.cursorRow = 0;
    this.cursorColumn = 0;
  }

  generateNewBoard() {
    let board= [];
    for (let i = 0; i < this.size; i++) {
      board[i] = [];
      for (let j = 0; j < this.size; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

  determineNumberOfMines() {
    switch(this.difficulty) {
      case '1':
        return Math.floor(this.totalNumOfSquares * 0.075);
        break;
      case '2':
        return Math.floor(this.totalNumOfSquares * 0.1);
        break;
      case '3':
        return Math.floor(this.totalNumOfSquares * 0.125);
    }
  }

  generateNewViewBoard() {

  }
}




var x = new MineBoard(5, 1);
console.log(x.board, 'board');



function clearConsole() {
  console.log("\x1B[2J");
}



module.exports = {
  MineBoard,
};
