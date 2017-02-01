'use strict';
const helpers = require('./src/helpers');
const MineBoard = require('./src/MineBoard').MineBoard;

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

readline.emitKeypressEvents(process.stdin);

// Set inital input state to readline mode
let readLineMode = true;

// Declare functions for switching input mode between key event listener and
// readline mode
function switchToReadLineMode() {
  readLineMode = true;
}

function switchToKeypressMode() {
  readLineMode = false;
}

//Initialze kepress listener
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }

  if (!readLineMode) { //only handle keypress if in keypress mode
    handleKeyPress(key);
  }

});

//Set up functionality for keypress
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
    case 'n':
      switchToReadLineMode(); //Prepares program to handle input for new game
      startGame();
      break;
    case 'r':
      startGame(board.size, board.difficulty);
      break;
    case 'm':
      board.markSpace();
      break;
  }
}

//initialize game board
let board;

function startGame(size, difficulty) {
  size = size || helpers.promptForBoardSize(rl);
  difficulty = difficulty || helpers.promptForDifficultyLevel(rl);
  board = new MineBoard(size, difficulty);

  // Switch input from readline to listen to key events
  switchToKeypressMode();
  board.printViewBoardToConsole();
}


startGame();
