const { MineBoard, _privateProps } = require('../src/MineBoard.js');
const board = new MineBoard(5, '1');
let u = board.uncoveredSpace;
let b = board.bomb;
let s = board.coveredSpace;
let m = board.marker;
let c = board.cursor;
let j = ' ';


const tests = {

  test1: [ //move the cursor to the right
    [s,c,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),


  test2: [ //right, down
    [s,s,s,s,s].join(' '),
    [s,c,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),

  test3: [ //right, down, left
    [s,s,s,s,s].join(' '),
    [c,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),

  test4: [ //right, down, left, left
    [s,s,s,s,s].join(' '),
    [c,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),

  test5: [ //right, down, left, left, up
    [c,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),

  test6: [ //right, down, left, left, up
    [c,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
    [s,s,s,s,s].join(' '),
  ].join('\n'),


};


module.exports  = {
  tests,
};
