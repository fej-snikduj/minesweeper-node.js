const { _privateProps } = require('../src/MineBoard.js');

function captureLoggedMessage(context, method, ...args) {
    let oldLog = console.log, loggedMessage = [];
    let size = context.getSize();

    console.log = function(s) {

      // Only capture the printed board by comparing string length to board size
      if (s.length === size * 2 - 1) {
        loggedMessage.push(s);
      }
    };

    context[method].call(context, ...args);
    console.log = oldLog;

    // If multiple boards were printed to console, only take the latest
    loggedMessage = loggedMessage.length > size ? loggedMessage.slice(size) :
        loggedMessage;

    return loggedMessage.join('\n');
}


function createTestBoard(boardInstance, makeSimpleBoard) {
  let props = _privateProps.get(boardInstance);
  let b = boardInstance.bomb; //mine
  if (makeSimpleBoard) {
    props.mineBoard = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,0,0,0,0],
      [b,1,0,0,0,0],
    ];
  } else {
    props.mineBoard = [
      [0,1,1,2,1,1],
      [0,1,b,3,b,1],
      [0,1,2,b,2,1],
      [0,0,1,1,1,0],
      [1,1,0,0,0,0],
      [b,1,0,0,0,0],
    ];
  }
  return props.mineBoard;
}

module.exports = {
  captureLoggedMessage,
  createTestBoard
};
