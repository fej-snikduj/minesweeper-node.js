
//clear terminal before starting
clearConsole();

//get input parameters from user
promptForBoardSize();


function startGame() {
  clearConsole();
  console.log(`starting game with board size ${boardSize} at level ${difficultyLevel}...`);
  calculateNumberOfMinesFromDifficulty();
  setInitialVariables();
  initializeMineBoard();
  initializeViewBoard();
  //only intialize keypress listeners once per node instance
  if (gameCount === 0) {
    initializeKeypressListeners();
  }
  renderBoardToConsole();

}




function initializeMineBoard() {
  createEmptyMineBoard();
  addMines();
  fillInNumbers();
}



function addMines() {
  //generate random mine placement
  for (var i = 0; i < numOfMines; i++) {
    var row = Math.floor(Math.random() * boardSize);
    var column = Math.floor(Math.random() * boardSize);
    //if no mine at indices, place mine, otherwise subtract 1 from i and repeat
    if (mineBoard[row][column] === 0) {
      mineBoard[row][column] = '*';
    } else {
      i--;
    }
  }

}

function fillInNumbers() {

  for (var row = 0; row < mineBoard.length; row++) {
    for (var column = 0; column < mineBoard[row].length; column++) {
      if (mineBoard[row][column] === '*') {
        continue;
      }
      var numOfBombsInVicinity = 0;
      if (row - 1 >= 0 && column - 1 >= 0) {
        if (mineBoard[row - 1][column - 1] === '*') {
          numOfBombsInVicinity++;
        }
      }

      if (row - 1 >= 0) {
        if (mineBoard[row - 1][column] === '*') {
          numOfBombsInVicinity++;
        }
      }

      if (row - 1 >= 0 && column + 1 < boardSize) {
        if (mineBoard[row - 1][column + 1] === '*') {
          numOfBombsInVicinity++;
        }
      }

      if (column - 1 >= 0) {
        if (mineBoard[row][column - 1] === '*') {
          numOfBombsInVicinity++;
        }
      }

      if (column + 1 < boardSize) {
        if (mineBoard[row][column + 1] === '*') {
          numOfBombsInVicinity++;
        }
      }

      if (row + 1 < boardSize && column - 1 >= 0) {
        if (mineBoard[row + 1][column - 1] === '*') {
          numOfBombsInVicinity++;
        }
      }
      if (row + 1 < boardSize) {
        if (mineBoard[row + 1][column] === '*') {
          numOfBombsInVicinity++;
        }
      }
      if (row + 1 < boardSize && column + 1 < boardSize) {
        if (mineBoard[row + 1][column + 1] === '*') {
          numOfBombsInVicinity++;
        }
      }
      mineBoard[row][column] = numOfBombsInVicinity;

    }
  }
}

function initializeViewBoard() {
  viewBoard = [];
  for (var i = 0; i < boardSize; i++) {
    viewBoard[i] = [];
    for (var j = 0; j < boardSize; j++) {
      viewBoard[i][j] = '[  ]';
    }
  }
}

function initializeKeypressListeners() {
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }

    switch (key.name) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        moveCursor(key.name);
        updateCursorView();
        if (!endGameBoolean) {
          renderBoardToConsole();
        }
        break;
      case 'space':
        checkForBombs();
        break;
      case 'n':
        gameCount++;
        startGame();
        break;
      case 'r':
        gameCount++;
        rl.clearLine();
        promptForBoardSize();
        break;
      case 'm':
        markSpace();
        break;
    }


  });
}

function moveCursor(direction) {
  previousCursorLocation.row = cursorLocation.row;
  previousCursorLocation.column = cursorLocation.column;

  switch(direction) {
    case 'up':
      cursorLocation.row = cursorLocation.row - 1 >= 0 ? cursorLocation.row - 1 : cursorLocation.row;
      break;
    case 'down':
      cursorLocation.row = cursorLocation.row + 1 < boardSize ? cursorLocation.row + 1 : cursorLocation.row;
      break;
    case 'right':
      cursorLocation.column = cursorLocation.column + 1 < boardSize ? cursorLocation.column + 1 : cursorLocation.column;
      break;
    case 'left':
      cursorLocation.column = cursorLocation.column - 1 >= 0 ? cursorLocation.column - 1 : cursorLocation.column;
      break;
  }
}

function updateCursorView() {
  if (!endGameBoolean && typeof(viewBoard[previousCursorLocation.row][previousCursorLocation.column]) !== 'number') {
    //remove brackets from previous cursor location
    if(viewBoard[previousCursorLocation.row][previousCursorLocation.column].match(/_/)) {
      viewBoard[previousCursorLocation.row][previousCursorLocation.column] = viewBoard[previousCursorLocation.row][previousCursorLocation.column].replace('_', '');

    }
  }
  if (!endGameBoolean) {
    //set current cursor location
    viewBoard[cursorLocation.row][cursorLocation.column] = viewBoard[cursorLocation.row][cursorLocation.column] + '_';
  }
}

function renderBoardToConsole() {
  clearConsole();
  for (var i = 0; i < mineBoard.length; i++) {
    var line = viewBoard[i].join('   ');
    console.log(line);
    console.log('\n');
  }
  console.log('Welcome to Minesweeper for Node.js!\n  Use the arrow keys to move around.\n  Use the "m" key to flag a box and the "space" key to uncover one.\n  Press "ctr + c" to quit, "n" to restart, and "r" to change level');
}

function checkForBombs() {
  if (viewBoard[cursorLocation.row][cursorLocation.column].match(/b/)) {
    console.log('you must unmark the bomb first before selecting it.  This is for your protection ;)');
    return;
  }
  if (mineBoard[cursorLocation.row][cursorLocation.column] === '*') {
    endGame(mineBoard);
  } else {
    updateViewBoard(cursorLocation.row, cursorLocation.column, {});
    renderBoardToConsole();
    if (uncoveredCount >= winningCount) {
      winGame();
    }
  }
}

function markSpace() {
  if (viewBoard[cursorLocation.row][cursorLocation.column] === '[  ]_'){
    viewBoard[cursorLocation.row][cursorLocation.column] = ' !b!_';
    renderBoardToConsole(viewBoard);
  } else if (viewBoard[cursorLocation.row][cursorLocation.column] === ' !b!_') {
    viewBoard[cursorLocation.row][cursorLocation.column] = '[  ]_';
    renderBoardToConsole(viewBoard);
  } else {
    return;
  }
}

function updateViewBoard(row, column, alreadyCoveredMapObj) {
  var key = 'row' + row + 'column' + column;
  //if this spot has already been checked, return
  if (alreadyCoveredMapObj[key]) {
    return;
  }
  //add this spot to the checked list
  alreadyCoveredMapObj[key] = true;

  //if this spot is out of bounds, return
  if (row >= mineBoard.length || column >= mineBoard[0].length || row < 0 || column < 0) {
    return;
  }

  //if this spot is a bomb, do nothing and return
  if (mineBoard[row][column] === '*') {
    return;
  }

  //base case is when the square is anything but a zero - we only continue if it is a zero
  if(mineBoard[row][column] !== 0) {
    viewBoard[row][column] = ' ' + mineBoard[row][column] + '  ';
    uncoveredCount++;
    return;
  }

  viewBoard[row][column] = ' ' + mineBoard[row][column] + '  ';
  uncoveredCount++;

  updateViewBoard(row - 1, column - 1, alreadyCoveredMapObj);
  updateViewBoard(row - 1, column, alreadyCoveredMapObj);
  updateViewBoard(row - 1, column + 1, alreadyCoveredMapObj);
  updateViewBoard(row, column - 1, alreadyCoveredMapObj);
  updateViewBoard(row, column + 1, alreadyCoveredMapObj);
  updateViewBoard(row + 1, column - 1, alreadyCoveredMapObj);
  updateViewBoard(row + 1, column, alreadyCoveredMapObj);
  updateViewBoard(row + 1, column + 1, alreadyCoveredMapObj);
}

function endGame() {
  clearConsole();
  for (var i = 0; i < mineBoard.length; i++) {
    var line = mineBoard[i].join('     ');
    console.log('  ' + line + '\n');
  }
  console.log('OH NO!  Looks like there was a bomb there :/\nPress "N" to play again.\nPress "R" to reset Board Size and or Level".\nPress "Ctrl + c" to exit game');
  endGameBoolean = true;

}

function winGame() {
  clearConsole();
  console.log('YOU WON!!!\nPress "N" to play again.\nPress "R" to reset Board Size and or Level".\nPress "Ctrl + c" to exit game');

}
