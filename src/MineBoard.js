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
    // generate new board requires number of mines to be determined first
    props.mineBoard = this.generateNewBoard();
    props.uncoveredCount = 0;
    props.winningUncoveredCount = props.totalNumOfSquares - props.numberOfMines;
    props.viewBoard = this.generateNewViewBoard();
    props.cursorRow = 0;
    props.cursorColumn = 0;
  }


  determineNumberOfMines() {
    let props = _privateProps.get(this);
    switch(props.difficulty) {
      case '1':
        return Math.floor(props.totalNumOfSquares * 0.075);
        break;
      case '2':
        return Math.floor(props.totalNumOfSquares * 0.1);
        break;
      case '3':
        return Math.floor(props.totalNumOfSquares * 0.125);
    }
  };

  generateNewBoard() {
    let props = _privateProps.get(this);
    let board= [];
    let size = props.size;
    let numOfMines = props.numberOfMines;
    // create board of zeros
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = 0;
      }
    }

    // generate random mine placement
    for (let i = 0; i < numOfMines; i++) {
      let row = Math.floor(Math.random() * size);
      let column = Math.floor(Math.random() * size);
      //if no mine at indices, place mine, otherwise subtract 1 from i and repeat
      if (board[row][column] === 0) {
        board[row][column] = this.bomb;
      } else {
        i--;
      }
    }
    //generate proximity numbers
    this.determineMineProximityNumbers(board);

    return board;
  }

  determineMineProximityNumbers(board) {
    let relationalIndicesMap = _privateProps.get(this).relationalIndicesMap;

    for (var row = 0; row < board.length; row++) {
      for (var column = 0; column < board[row].length; column++) {

        //skip over mines
        if (board[row][column] === this.bomb) {
          continue;
        }

        //keep track of number of bombs adjacent to current indices
        var numOfBombsInVicinity = 0;

        relationalIndicesMap.forEach(relIndex => {
          let rowToCheck = row + relIndex.row;
          let colToCheck = column + relIndex.col;
          if (!this.isInBounds(rowToCheck, colToCheck)) return;
          if (board[rowToCheck][colToCheck] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }, this);

        //label square with result
        board[row][column] = numOfBombsInVicinity;
      }
    }
  }


  generateNewViewBoard() {
    let props = _privateProps.get(this);
    let viewBoard = [];
    let size = props.size;
    for (let i = 0; i < size; i++) {
      viewBoard[i] = [];
      for (let j = 0; j < size; j++) {
        viewBoard[i][j] = this.coveredSpace;
      }
    }

    return viewBoard;
  }

  isInBounds(row, col) {
    let size = _privateProps.get(this).size;
    let rowInBounds = row >= 0 && row < size ? true : false;
    let colInBounds = col >= 0 && col < size ? true : false;
    return rowInBounds && colInBounds;
  }

  printViewBoardToConsole() {
    let props = _privateProps.get(this);
    let row = props.cursorRow;
    let col = props.cursorColumn;
    let size = props.size;
    //clear the console before printing
    this.clearConsole();
    /*
    Instead of updating the actual view board with the cursor position, a
    deep copy is made which prevents having to track the state of the square
    under the cursor
    */
    let board = JSON.parse(JSON.stringify(props.viewBoard));

    //update the view at current cursor location
    board[row][col] = this.cursor;

    //print updated viewboard with cursor location to console
    for (let i = 0; i < size; i++) {
      var line = board[i].join(' ');
      console.log(line);
    }
    this.printInstructions();
  }

  moveCursor(direction) {
    let props = _privateProps.get(this);
    let row = props.cursorRow;
    let col = props.cursorColumn;

    //change cursor location based on direction
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
    //reprint board to console
    this.printViewBoardToConsole();

  }

  markSpace() {
    let props = _privateProps.get(this);
    let board = props.viewBoard;
    let row = props.cursorRow;
    let col = props.cursorColumn;

    //If the space is uncovered and unmarked, mark it
    if (board[row][col] === this.coveredSpace) {
      board[row][col] = this.marker;
    } else if (board[row][col] === this.marker) { //if marked, unmark it
      board[row][col] = this.coveredSpace;
    }

  }

  isSpaceMarked() {
    let props = _privateProps.get(this);
    if (props.viewBoard[props.cursorRow][props.cursorColumn] === this.marker) {
      return true;
    } else {
      return false;
    }
  }

  uncoverSpace() {
    let props = _privateProps.get(this);
    let mineBoard = props.mineBoard;
    let viewBoard = props.viewBoard;
    let row = props.cursorRow;
    let col = props.cursorColumn;
    let size = props.size;

    //do not allow uncovering of marked spaces
    if (this.isSpaceMarked()) {
      return;
    }

    //call game over if bomb detected
    if (mineBoard[row][col] === this.bomb) {
      this.gameOver();
      return;
    }

    //if space is anything but a zero, uncover it
    if (mineBoard[row][col] !== 0) {
      viewBoard[row][col] = mineBoard[row][col];
      this.printViewBoardToConsole();
      props.uncoveredCount++;
      return;
    }

    // Assign bomb to variable for use inside of uncoverdAdjacentSpaces function
    let bomb = this.bomb;
    let uncoveredSpace = this.uncoveredSpace;

    //if space is zero, uncover adjacent spaces as well
    if (mineBoard[row][col] === 0) {
      uncoverAdjacentSpaces(row, col, {}, this);
      this.printViewBoardToConsole();
    }



    //Function to uncover adjacent spaces if space is not adjacent to any bombs
    function uncoverAdjacentSpaces(row, col, alreadyCoveredMap, thisArg) {
      // Space is a zero (not adjacent to any bombs)
      // Uncover, increase count
      viewBoard[row][col] = uncoveredSpace;
      props.uncoveredCount++;
      // Create key to mark spot as checked
      let key = 'r' + row + 'c' + col;
      //add this spot to the checked list
      alreadyCoveredMap[key] = true;
      /*
      Check Adjacent Squares.  Uncover all non-bombs, and recurse on zeros
      */
      props.relationalIndicesMap.forEach(relIndex => {
        let rowToCheck = row + relIndex.row;
        let colToCheck = col + relIndex.col;
        let keyToCheck = 'r' + rowToCheck + 'c' + colToCheck;
        if (!thisArg.isInBounds(rowToCheck, colToCheck)) return;
        if (keyToCheck in alreadyCoveredMap) return;
        if (mineBoard[rowToCheck][colToCheck] > 0) {
          viewBoard[rowToCheck][colToCheck] = mineBoard[rowToCheck][colToCheck];
        } else { // Space equals zero, so recurse
          uncoverAdjacentSpaces(rowToCheck, colToCheck, alreadyCoveredMap, thisArg);
        }
      }, this);
  }
}

  gameOver() {
    this.clearConsole();
    console.log('GAME OVER');
    this.printInstructions();
  }

  printInstructions() {
    console.log(
        `Welcome to Minesweeper for Node.js!\n` +
        `Use the arrow keys to move around.\n` +
        `Use the 'm' key to flag a box and the 'space' key to uncover one.\n` +
        `Press 'ctr + c' to quit,'r' to restart, and 'n' for a new game`
    );
  }

  clearConsole() {
    console.log("\x1B[2J");
  }
}

var x = new MineBoard(10, '1');
var y = _privateProps.get(x);
console.log(y)

// console.log(String.fromCharCode(9762))



module.exports = {
  MineBoard,
};
