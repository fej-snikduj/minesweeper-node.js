const chai = require('chai');
const assert = chai.assert;
const { MineBoard } = require('../src/MineBoard.js');
const { tests } = require('./view_test_boards.js');
const {captureLoggedMessage, createTestBoard } = require('./test_helpers.js');

describe('MineBoard Class', function() {

  describe('Instantiation', function() {
    it('should return an instance of itself', function() {
      let board = new MineBoard();
      assert.instanceOf(board, MineBoard, 'board is an instance of MineBoard');
    });

    it('should have the proper size and difficulty values', function () {
      let board = new MineBoard(22, '2');
      assert.equal(board.size, 22, 'size should equal 22');
      assert.equal(board.difficulty, '2', 'difficulty should equal 2');
    });
  });

  describe('Determine Proximity Numbers Method', function() {
    it('should correctly determine proximity numbers of each space', function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      board.determineMineProximityNumbers(board.mineBoard);
      assert.deepEqual(board.mineBoard, tests.test13);
    });
  });
});
