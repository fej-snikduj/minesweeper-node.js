function captureLoggedMessage(context, method, ...args) {
    let oldLog = console.log, loggedMessage = [];
    let size = context.size;

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
  let b = boardInstance.bomb; //mine
  if (makeSimpleBoard) {
    boardInstance.mineBoard = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,0,0,0,0],
      [b,1,0,0,0,0],
    ];
  } else {
    boardInstance.mineBoard = [
      [0,1,1,2,1,1],
      [0,1,b,3,b,1],
      [0,1,2,b,2,1],
      [0,0,1,1,1,0],
      [1,1,0,0,0,0],
      [b,1,0,0,0,0],
    ];
  }
  return boardInstance.mineBoard;
}

module.exports = {
  captureLoggedMessage,
  createTestBoard
};
