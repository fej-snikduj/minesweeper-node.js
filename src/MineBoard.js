'use strict';
/* Instantiate a WeakMap to hold private MineBoard class variables */
let _privateProps = new WeakMap();

class MineBoard {
  constructor(size, difficulty) {
    // Set the display values
    this.cursor = String.fromCharCode(9670);
    this.marker = String.fromCharCode(9873);
    this.uncoveredSpace = ' ';
    this.coveredSpace = String.fromCharCode(9634);
    this.bomb = String.fromCharCode(9762);

    // Store props in WeakMap to restrict access to class methods
    let props = {};
    _privateProps.set(this, props);
    // This map allows for easy iteration of all squares surrounding each square
    props.relationalIndicesMap = [
      {row: -1, col: -1},
      {row: -1, col: 0},
      {row: -1, col: 1},
      {row: 0, col: -1},
      {row: 0, col: 1},
      {row: 1, col: -1},
      {row: 1, col: 0},
      {row: 1, col: 1},
    ];
    props.size = size || 20;
    props.difficulty = difficulty || '1';
    props.totalNumOfSquares = props.size ** 2;
    props.numberOfMines = this.determineNumberOfMines();
    // Generate new board requires number of mines to be determined first
    props.mineBoard = this.generateNewBoard();
    props.uncoveredCount = 0;
    props.winningUncoveredCount = props.totalNumOfSquares - props.numberOfMines;
    props.viewBoard = this.generateNewViewBoard();
    props.cursorRow = 0;
    props.cursorColumn = 0;
    props.gameOver = false;
  }


  determineNumberOfMines() {
    let { difficulty, totalNumOfSquares } = _privateProps.get(this);
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

  generateNewBoard() {
    let { size, numberOfMines } = _privateProps.get(this);
    let board= [];
    // Create board of zeros
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = 0;
      }
    }

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
    let { relationalIndicesMap, size } = _privateProps.get(this);

    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {

        // Skip over mines
        if (board[row][column] === this.bomb) {
          continue;
        }

        // Keep track of number of bombs adjacent to current indices
        let numOfBombsInVicinity = 0;

        // Iterate over 8 surround squares
        relationalIndicesMap.forEach(relIndex => {
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


  generateNewViewBoard() {
    let { size } = _privateProps.get(this);
    let viewBoard = [];

    for (let i = 0; i < size; i++) {
      viewBoard[i] = [];
      for (let j = 0; j < size; j++) {
        viewBoard[i][j] = this.coveredSpace;
      }
    }

    return viewBoard;
  }

  isInBounds(row, col) {
    let { size } = _privateProps.get(this);
    let rowInBounds = row >= 0 && row < size ? true : false;
    let colInBounds = col >= 0 && col < size ? true : false;
    return rowInBounds && colInBounds;
  }

  printViewBoardToConsole() {
    let { cursorRow: row, cursorColumn: col, size, viewBoard } =
        _privateProps.get(this);

    // Clear the console before printing
    this.clearConsole();

    // Make copy of board for purpose of printing with cursor
    let board = JSON.parse(JSON.stringify(viewBoard));

    // Update the view at current cursor location
    board[row][col] = this.cursor;

    // Print updated viewboard with cursor location to console
    board.forEach(row => {
      console.log(row.join(' '));
    });
    // Only print short instructions each time.
    this.printShortInstructions();
  }

  moveCursor(direction) {
    let props = _privateProps.get(this);
    let { cursorRow: row, cursorColumn: col } = _privateProps.get(this);

    // Change cursor location based on direction
    switch(direction) {
      case 'up':
        props.cursorRow = this.isInBounds(row - 1, col) ? row - 1 : row;
        break;
      case 'down':
        props.cursorRow = this.isInBounds(row + 1, col) ? row + 1 : row;
        break;
      case 'left':
        props.cursorColumn = this.isInBounds(row, col - 1) ? col - 1 : col;
        break;
      case 'right':
        props.cursorColumn = this.isInBounds(row, col + 1) ? col + 1 : col;
    }
    // Reprint board to console
    this.printViewBoardToConsole();

  }

  markSpace() {
    let { viewBoard: board, cursorRow: row, cursorColumn: col } =
        _privateProps.get(this);

    // If the space is uncovered and unmarked, mark it
    if (board[row][col] === this.coveredSpace) {
      board[row][col] = this.marker;
    } else if (board[row][col] === this.marker) { // If marked, unmark it
      board[row][col] = this.coveredSpace;
    }

  }

  isSpaceMarked() {
    let { viewBoard, cursorRow, cursorColumn } = _privateProps.get(this);
    if (viewBoard[cursorRow][cursorColumn] === this.marker) {
      return true;
    } else {
      return false;
    }
  }

  uncoverSpace() {
    let props = _privateProps.get(this);
    let { cursorRow: row, cursorColumn: col, mineBoard, viewBoard, size } =
        _privateProps.get(this);

    // Do not allow uncovering of marked spaces
    if (this.isSpaceMarked()) {
      return;
    }

    // Call game over if bomb detected
    if (mineBoard[row][col] === this.bomb) {
      this.gameOver();
      return;
    }

    // If space is anything but a zero, uncover it
    if (mineBoard[row][col] !== 0) {
      viewBoard[row][col] = mineBoard[row][col];
      props.uncoveredCount++;
      this.printViewBoardToConsole();
      this.checkForWinGame();
      return;
    }

    // If space is zero, uncover adjacent spaces as well
    if (mineBoard[row][col] === 0) {
      uncoverAdjacentSpaces(row, col, this);
      this.printViewBoardToConsole();
      this.checkForWinGame();
      return;
    }


    // Function to uncover adjacent spaces if space is not adjacent to any bombs
    function uncoverAdjacentSpaces(row, col, thisArg) {
      // Space is a zero (not adjacent to any bombs)
      // Uncover, increase count
      viewBoard[row][col] = thisArg.uncoveredSpace;
      props.uncoveredCount++;
      /*
      Check Adjacent Squares.  Uncover all non-bombs, and recurse on zeros
      */
      props.relationalIndicesMap.forEach(relIndex => {
        let rowToCheck = row + relIndex.row;
        let colToCheck = col + relIndex.col;
        if (!thisArg.isInBounds(rowToCheck, colToCheck)) return;
        if (viewBoard[rowToCheck][colToCheck] !== thisArg.coveredSpace) return;
        if (mineBoard[rowToCheck][colToCheck] === thisArg.bomb) return;
        if (mineBoard[rowToCheck][colToCheck] > 0) {
          viewBoard[rowToCheck][colToCheck] = mineBoard[rowToCheck][colToCheck];
          props.uncoveredCount++;
        } else { // Space equals zero, so recurse
          uncoverAdjacentSpaces(rowToCheck, colToCheck, thisArg);
        }
      }, this);
    }
  }

  checkForWinGame() {
    let { uncoveredCount, winningUncoveredCount } = _privateProps.get(this);
    if (uncoveredCount >= winningUncoveredCount) {
      this.winGame();
      return;
    } else {
      return;
    }
  }

  gameOver() {
    let { mineBoard } = _privateProps.get(this);
    this.clearConsole();
    // Print modified board to console, showing bombs.
    mineBoard.forEach(row => {
      let updatedRow = row.map(value => {
        return value === 0 ? ' ' : value;
      });
      console.log(updatedRow.join(' '));
    });

    console.log('GAME OVER');
    this.printShortInstructions();

    // Update Game Over Boolean
    _privateProps.get(this).gameOver = true;
  }

  winGame() {
    let { mineBoard } = _privateProps.get(this);
    this.clearConsole();

    // Print modified board to console, showing flags.
    mineBoard.forEach(row => {
      let updatedRow = row.map(value => {
        if (value === 0) {
          return ' ';
        } else if (value === this.bomb) {
          return this.marker;
        } else {
          return value;
        }
      }, this);
      console.log(updatedRow.join(' '));
    }, this);

    console.log('YOU WIN!!!');
    console.log(_privateProps.get(this).uncoveredCount)
    this.printShortInstructions();

    // Update Game Over Boolean
    _privateProps.get(this).gameOver = true;
  }

  isGameOver() {
    return _privateProps.get(this).gameOver;
  }

  printShortInstructions() {
    console.log(
        `Welcome to Minesweeper for Node.js!  Press 'i' to to see instructions.\n`
    );
  }

  printLongInstructions() {
    console.log(
        `Welcome to Minesweeper for Node.js!\n` +
        `Use the arrow keys to move around.\n` +
        `Use the 'm' key to flag a box and the 'space' key to uncover one.\n` +
        `Press 'ctr + c' to quit,'r' to restart, and 'n' for a new game\n` +
        `Press 'h' to hide these instructions.`
    );
  }

  clearConsole() {
    console.log("\x1B[2J");
  }

  getSize() {
    return _privateProps.get(this).size;
  }

  getDifficulty() {
    return _privateProps.get(this).difficulty;
  }
}

module.exports = {
  MineBoard,
};
