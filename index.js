'use strict';
const { promptForBoardSize, promptForDifficultyLevel, promptUserForInputs } =
    require('./src/helpers');
const { MineBoard } = require('./src/MineBoard');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

// Allow keypress events to be emitted through stdin
readline.emitKeypressEvents(process.stdin);

// Deactivate gameplay key bindings until game starts
let gamePlay = false;

// Declare functions for toggling gameplay key bindings
function toggleGamePlayOn() {
  gamePlay = true;
}
function toggleGamePlayOff() {
  gamePlay = false;
}

// Initialze kepress listeners
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }

  if (key.name === 'n') {
    toggleGamePlayOff();
    promptUserForInputs(rl, startGame);
  }

  if (key.name === 'r' && board) {
    startGame(board.getSize(), board.getDifficulty());
  }

  if (key.name === 'i' && board) {
    board.printLongInstructions();
  }

  if (key.name === 'h' && board) { //hide long instructions
    board.printViewBoardToConsole();
  }
  if (gamePlay) { // Only handle keypress if in gameplay
    handleKeyPress(key);
  }

});

// Set up functionality for gameplay
function handleKeyPress(key) {
  switch (key.name) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
      board.moveCursor(key.name);
      break;
    case 'space':
      board.uncoverSpace();
      break;
    case 'm':
      board.markSpace();
      break;
  }
  if (board.isGameOver()) {
    toggleGamePlayOff();
  }
}

// Initialize game board
let board;

function startGame(size, difficulty) {

  board = new MineBoard(size, difficulty);

  // Switch input from readline to listen to key events
  toggleGamePlayOn();
  board.printViewBoardToConsole();
}

promptUserForInputs(rl, startGame);
