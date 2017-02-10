const chai = require('chai');
const assert = chai.assert;
const { MineBoard, _privateProps } = require('../src/MineBoard.js');
const board = new MineBoard(5, '1');
const { tests } = require('./view_test_boards.js');
let u = board.uncoveredSpace;
let b = board.bomb;
let s = board.coveredSpace;
let m = board.marker;
let c = board.cursor;

function captureLoggedMessage(context, method, ...args) {
    let oldLog = console.log, loggedMessage = [];

    console.log = function(s) {

      // Only capture the printed board by comparing string length to board size
      if (s.length === context.getSize() * 2 - 1) {
        loggedMessage.push(s);
      }
    };

    context[method].call(context, ...args);
    console.log = oldLog;
    return loggedMessage.join('\n');
}


function createTestBoard(boardInstance) {
  let { mineBoard } = _privateProps.get(boardInstance);
  let m = boardInstance.bomb; //mine
  mineBoard = [
    [0,1,1,2,1,1],
    [0,1,m,3,m,1],
    [0,0,2,m,2,1],
    [1,1,1,1,1,0],
    [m,1,0,0,0,0],
  ];
  return mineBoard;
}



describe('MineBoard', function() {
  describe('Instantiation', function() {
    it('should return an instance of itself', function() {
      let board = new MineBoard();
      assert.instanceOf(board, MineBoard, 'board is an instance of MineBoard');
    });

    it('should have the proper size and difficulty values', function () {
      let board = new MineBoard(22, '2');
      assert.equal(board.getSize(), 22, 'size should equal 22');
      assert.equal(board.getDifficulty(), '2', 'difficulty should equal 2');
    });

    // Methods to test [moveCursor, uncoverSpace, markSpace]
    // test1 through test 6
    it('should only allow cursor movements within board', function () {
      let board = new MineBoard(5, '1');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test1
      );
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'down'),
        tests.test2
      );
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'left'),
        tests.test3
      );
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'left'),
        tests.test4
      );
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'up'),
        tests.test5
      );
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'up'),
        tests.test6
      );
    });

  });
});
