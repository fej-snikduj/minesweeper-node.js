const chai = require('chai');
const assert = chai.assert;
const { MineBoard, _privateProps } = require('../src/MineBoard.js');
const { tests } = require('./view_test_boards.js');
const {captureLoggedMessage, createTestBoard } = require('./test_helpers.js');

describe('MineBoard Class', function() {
  describe('Determine Proximity Numbers Method', function() {
    it('should correctly determine proximity numbers of each space', function() {
      let board = new MineBoard(6, '1');
      createTestBoard(board);
      board.determineMineProximityNumbers(_privateProps.get(board).mineBoard);
      assert.deepEqual(_privateProps.get(board).mineBoard, tests.test13);
    });
  });
});
