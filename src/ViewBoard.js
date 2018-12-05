'use strict';
let { MineBoard } = require('./MineBoard.js');

class ViewBoard extends MineBoard {
  constructor(size, difficulty) {
    super(size, difficulty);

    // Set the display values
    // this.cursor = String.fromCharCode(9670);
    this.cursor = '_';
    this.marker = String.fromCharCode(9635);
    this.uncoveredSpace = ' ';
    this.coveredSpace = String.fromCharCode(9634);

    // Create starting view board
    this.viewBoard = this.generateNewViewBoard();
    this.uncoveredCount = 0;
    this.winningUncoveredCount = this.totalNumOfSquares - this.numberOfMines;
    this.cursorRow = 0;
    this.cursorColumn = 0;
    this.gameOver = false;
  }

  generateNewViewBoard() {
    let viewBoard = [];

    for (let i = 0; i < this.size; i++) {
      viewBoard[i] = [];
      for (let j = 0; j < this.size; j++) {
        viewBoard[i][j] = this.coveredSpace;
      }
    }
    return viewBoard;
  }



  printViewBoardToConsole(showCursor = true) {
    let { cursorRow: row, cursorColumn: col, size, viewBoard } = this;

    // Clear the console before printing
    this.clearConsole();

    // Make copy of board for purpose of printing with cursor
    let board = JSON.parse(JSON.stringify(viewBoard));

    if (showCursor) {
      // Update the view at current cursor location
      board[row][col] = this.cursor;
    }

    // Print updated viewboard with cursor location to console
    board.forEach(row => {
      console.log(row.join(' '));
    });
    // Only print short instructions each time.
    this.printShortInstructions();
  }

  moveCursor(direction) {
    let { cursorRow: row, cursorColumn: col } = this;

    // Change cursor location based on direction
    switch(direction) {
      case 'up':
        this.cursorRow = this.isInBounds(row - 1, col) ? row - 1 : row;
        break;
      case 'down':
        this.cursorRow = this.isInBounds(row + 1, col) ? row + 1 : row;
        break;
      case 'left':
        this.cursorColumn = this.isInBounds(row, col - 1) ? col - 1 : col;
        break;
      case 'right':
        this.cursorColumn = this.isInBounds(row, col + 1) ? col + 1 : col;
    }
    // Reprint board to console
    this.printViewBoardToConsole();

  }

  markSpace() {
    let { viewBoard: board, cursorRow: row, cursorColumn: col } = this;

    // If the space is uncovered and unmarked, mark it
    if (board[row][col] === this.coveredSpace) {
      board[row][col] = this.marker;
    } else if (board[row][col] === this.marker) { // If marked, unmark it
      board[row][col] = this.coveredSpace;
    }
    this.printViewBoardToConsole(false);
  }

  isSpaceMarked() {
    let { viewBoard, cursorRow, cursorColumn } = this;
    if (viewBoard[cursorRow][cursorColumn] === this.marker) {
      return true;
    } else {
      return false;
    }
  }

  uncoverSpace() {
    let { mineBoard, cursorRow: row, cursorColumn: col, viewBoard, size,
        cursor, marker, uncoveredSpace, coveredSpace, bomb } = this;

    // Do not uncover marked spaces
    if (this.isSpaceMarked()) {
      return;
    }

    // Call game over if bomb detected
    if (mineBoard[row][col] === this.bomb) {
      this.loseGame();
      return;
    }


      // If space is anything but a zero, uncover it
     if (mineBoard[row][col] !== 0) {
         if (viewBoard[row][col] !== mineBoard[row][col]) {
             viewBoard[row][col] = mineBoard[row][col];
             this.uncoveredCount++;
             this.printViewBoardToConsole(false);
             this.checkForWinGame();
         } else {
             this.printViewBoardToConsole(true);
         }
         return;
     }

      // If space is zero, uncover adjacent spaces as well
     if (mineBoard[row][col] === 0) {
         if (viewBoard[row][col] !== this.uncoveredSpace) {
             uncoverAdjacentSpaces.call(this, row, col);
             this.printViewBoardToConsole(false);
             this.checkForWinGame();
         } else {
             this.printViewBoardToConsole(true);
         }
         return;
     }


    // Function to uncover adjacent spaces if space is not adjacent to any bombs
    function uncoverAdjacentSpaces(row, col) {
      // Space is a zero (not adjacent to any bombs)
      // Uncover, increase count
      viewBoard[row][col] = this.uncoveredSpace;
      this.uncoveredCount++;
      /*
      Check Adjacent Squares.  Uncover all non-bombs, and recurse on zeros
      */
      this.relationalIndicesMap.forEach(relIndex => {
        let rowToCheck = row + relIndex.row;
        let colToCheck = col + relIndex.col;
        if (!this.isInBounds(rowToCheck, colToCheck)) return;
        if (viewBoard[rowToCheck][colToCheck] !== this.coveredSpace) return;
        if (mineBoard[rowToCheck][colToCheck] === this.bomb) return;
        if (mineBoard[rowToCheck][colToCheck] > 0) {
          viewBoard[rowToCheck][colToCheck] = mineBoard[rowToCheck][colToCheck];
          this.uncoveredCount++;
        } else { // Space equals zero, so recurse
          uncoverAdjacentSpaces.call(this, rowToCheck, colToCheck);
        }
      }, this);
    }
  }


  checkForWinGame() {
    if (this.uncoveredCount >= this.winningUncoveredCount) {
      this.winGame();
      return;
    } else {
      return;
    }
  }

  loseGame() {
    this.clearConsole();
    // Print modified board to console, showing bombs.
    this.mineBoard.forEach(row => {
      let updatedRow = row.map(value => {
        return value === 0 ? ' ' : value;
      });
      console.log(updatedRow.join(' '));
    });

    console.log('GAME OVER');
    this.printLongInstructions();

    // Update Game Over Boolean
    this.gameOver = true;
  }

  winGame() {
    this.clearConsole();

    // Print modified board to console, showing flags.
    this.mineBoard.forEach(row => {
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
    this.printLongInstructions();

    // Update Game Over Boolean
    this.gameOver = true;
  }

  isGameOver() {
    return this.gameOver;
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
        `Use the 'x' key to flag a box and the 'space' key to uncover one.\n` +
        `Press 'ctr + c' to quit,'r' to restart, and 'n' for a new game\n` +
        `Press 'h' to hide these instructions.`
    );
  }

  clearConsole() {
    console.log("\x1B[2J");
  }
}

module.exports = {
  ViewBoard,
};
