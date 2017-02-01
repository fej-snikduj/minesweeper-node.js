'use strict';
/* Instantiate a WeakMap to hold private MineBoard class variables */
let _privateProps = new WeakMap();

class MineBoard {
  constructor(size, difficulty) {
    //set the display values
    this.cursor = String.fromCharCode(9670);
    this.marker = String.fromCharCode(9873);
    this.uncoveredSpace = ' ';
    this.coveredSpace = String.fromCharCode(9634);
    this.bomb = String.fromCharCode(9762);

    // Store props in WeakMap to restrict access to class methods
    let props = {};
    _privateProps.set(this, props);
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

    for (var row = 0; row < board.length; row++) {
      for (var column = 0; column < board[row].length; column++) {

        //skip over mines
        if (board[row][column] === this.bomb) {
          continue;
        }

        //keep track of number of bombs adjacent to current indices
        var numOfBombsInVicinity = 0;

        //check upper left
        if (row - 1 >= 0 && column - 1 >= 0) {
          if (board[row - 1][column - 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check directly above
        if (row - 1 >= 0) {
          if (board[row - 1][column] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check upper right
        if (row - 1 >= 0 && column + 1 < board.length) {
          if (board[row - 1][column + 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check directly left
        if (column - 1 >= 0) {
          if (board[row][column - 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check directly right
        if (column + 1 < board.length) {
          if (board[row][column + 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check bottom left
        if (row + 1 < board.length && column - 1 >= 0) {
          if (board[row + 1][column - 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check directly below
        if (row + 1 < board.length) {
          if (board[row + 1][column] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

        //check bottom right
        if (row + 1 < board.length && column + 1 < board.length) {
          if (board[row + 1][column + 1] === this.bomb) {
            numOfBombsInVicinity++;
          }
        }

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
        props.cursorRow = row - 1 >= 0 ? row - 1 : row;
        break;
      case 'down':
        props.cursorRow = row + 1 < props.size ? row + 1 : row;
        break;
      case 'left':
        props.cursorColumn = col - 1 >= 0 ? col - 1 : col;
        break;
      case 'right':
        props.cursorColumn = col + 1 < props.size ? col + 1 : col;
    }
    console.log(props.cursorRow, props.cursorColumn, 'row column')
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

    //if space is zero, uncover adjacent spaces as well
    if (mineBoard[row][col] === 0) {
      uncoverAdjacentSpaces.call(this, row, col, {});
    }


    //Function to uncover adjacent spaces if space is not adjacent to any bombs
    function uncoverAdjacentSpaces(rowToCheck, colToCheck, alreadyCoveredMap) {
      let key = 'row' + rowToCheck + 'col' + colToCheck;
      //if this spot has already been checked, return
      if (alreadyCoveredMap[key]) {
        return;
      }
      //add this spot to the checked list
      alreadyCoveredMap[key] = true;

      //if this spot is out of bounds, return
      if (rowToCheck >= size || colToCheck >= size || rowToCheck < 0 ||
          colToCheck < 0) {
        return;
      }

      //if this spot is a bomb, do nothing and return
      if (mineBoard[rowToCheck][colToCheck] === bomb) {
        return;
      }

      // Base case is when the space is anything but a zero
      // Only continue if it is a zero
      if(mineBoard[rowToCheck][colToCheck] !== 0) {
        viewBoard[rowToCheck][colToCheck] = mineBoard[rowToCheck][colToCheck];
        props.uncoveredCount++;
        return;
      }

      // Space is a zero
      // Uncover, increase count, and continue
      viewBoard[rowToCheck][colToCheck] = mineBoard[rowToCheck][colToCheck];
      props.uncoveredCount++;

      // Call function on all adjacent spaces
      uncoverAdjacentSpaces(rowToCheck - 1, colToCheck - 1, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck - 1, colToCheck, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck - 1, colToCheck + 1, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck, colToCheck - 1, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck, colToCheck + 1, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck + 1, colToCheck - 1, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck + 1, colToCheck, alreadyCoveredMap);
      uncoverAdjacentSpaces(rowToCheck + 1, colToCheck + 1, alreadyCoveredMap);
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

// var x = new MineBoard(10, '1');
// var y = _privateProps.get(x);
// console.log(y)
//
// console.log(String.fromCharCode(9762))



module.exports = {
  MineBoard,
};
