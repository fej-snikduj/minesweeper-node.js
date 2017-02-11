const chai = require('chai');
const assert = chai.assert;
const { MineBoard, _privateProps } = require('../src/MineBoard.js');
const board = new MineBoard(5, '1');
const { tests } = require('./view_test_boards.js');


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
  });

  describe('Move Cursor method', function() {
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

  describe('Uncover Space Method', function() {
    it('should correctly cascade when a mine with zero surround mines is uncovered',
        function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      assert.deepEqual(
        captureLoggedMessage(board, 'uncoverSpace'),
        tests.test7
      );
    });

    it('should not cascade when a mine touching another mine is uncovered',
        function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'moveCursor', 'right');
      captureLoggedMessage(board, 'uncoverSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test8
      );
    });

    it('should not uncover a marked space', function () {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'markSpace');
      captureLoggedMessage(board, 'uncoverSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test9
      );
    });

    it('should call gameOver if mine is uncovered', function () {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'moveCursor', 'right');
      captureLoggedMessage(board, 'moveCursor', 'right');
      captureLoggedMessage(board, 'moveCursor', 'down');
      captureLoggedMessage(board, 'uncoverSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'uncoverSpace'),
        tests.test10
      );
    });

    it('should call winGame if all spaces are uncovered except mines', function () {
      let board = new MineBoard(6, '1');
      createTestBoard(board, true);
      assert.deepEqual(
        captureLoggedMessage(board, 'uncoverSpace'),
        tests.test11
      );
    });
  });

  describe('Mark Space Method', function() {
    it('Should mark a space', function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'markSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test9
      );
    });
    it('Should unmark a space', function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'markSpace');
      captureLoggedMessage(board, 'markSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test12
      );
    });
  });


});
