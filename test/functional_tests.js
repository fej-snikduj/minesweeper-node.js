const chai = require('chai');
const assert = chai.assert;
const { ViewBoard } = require('../src/ViewBoard.js');
const { tests } = require('./view_test_boards.js');
const {captureLoggedMessage, createTestBoard } = require('./test_helpers.js');

describe('Functional', function() {
  describe('Move Cursor method', function() {
    // Methods to test [moveCursor, uncoverSpace, markSpace]
    // test1 through test 6
    it('should only allow cursor movements within board', function () {
      let board = new ViewBoard(5, '1');
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
      let board = new ViewBoard(6, '1');
      createTestBoard(board);
      assert.deepEqual(
        captureLoggedMessage(board, 'uncoverSpace', true),
        tests.test7
      );
    });

    it('should not cascade when a mine touching another mine is uncovered',
        function() {
      let board = new ViewBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'moveCursor', 'right');
      captureLoggedMessage(board, 'uncoverSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test8
      );
    });

    it('should not uncover a marked space', function () {
      let board = new ViewBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'markSpace');
      captureLoggedMessage(board, 'uncoverSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test9
      );
    });

    it('should call gameOver if mine is uncovered', function () {
      let board = new ViewBoard(6, '1');
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
      let board = new ViewBoard(6, '1');
      createTestBoard(board, true);
      assert.deepEqual(
        captureLoggedMessage(board, 'uncoverSpace'),
        tests.test11
      );
    });
  });

  describe('Mark Space Method', function() {
    it('Should mark a space', function() {
      let board = new ViewBoard(6, '1');
      createTestBoard(board);
      captureLoggedMessage(board, 'markSpace');
      assert.deepEqual(
        captureLoggedMessage(board, 'moveCursor', 'right'),
        tests.test9
      );
    });
    it('Should unmark a space', function() {
      let board = new ViewBoard(6, '1');
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
