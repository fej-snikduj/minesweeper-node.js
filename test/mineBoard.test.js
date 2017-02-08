const chai = require('chai');
const assert = chai.assert;
const MineBoard = require('../src/MineBoard.js').MineBoard;

function doesLogMessage(f, message) {
    let oldLog = console.log,
        result = false;

    console.log = function(s) {
        if (s == message) {
            result = true;
        }
    };

    f();

    console.log = oldLog;

    return result;
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
});
