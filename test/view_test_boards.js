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

  test7: [ //uncover 0,0
    [c,1,s,s,s,s].join(' '),
    [u,1,s,s,s,s].join(' '),
    [u,1,2,s,2,1].join(' '),
    [u,u,1,1,1,u].join(' '),
    [1,1,u,u,u,u].join(' '),
    [s,1,u,u,u,u].join(' '),
  ].join('\n'),

  test8: [ //uncover 0,1
    [s,1,c,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
  ].join('\n'),

  test9: [ //mark 0,0 - try to uncover - move cursor right
    [m,c,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
  ].join('\n'),

  test10: [ //mark 0,0 - try to uncover - move cursor right
    [u,1,1,2,1,1].join(' '),
    [u,1,b,3,b,1].join(' '),
    [u,1,2,b,2,1].join(' '),
    [u,u,1,1,1,u].join(' '),
    [1,1,u,u,u,u].join(' '),
    [b,1,u,u,u,u].join(' '),
  ].join('\n'),

  test11: [ //uncover 0,1
    [u,u,u,u,u,u].join(' '),
    [u,u,u,u,u,u].join(' '),
    [u,u,u,u,u,u].join(' '),
    [u,u,u,u,u,u].join(' '),
    [1,1,u,u,u,u].join(' '),
    [m,1,u,u,u,u].join(' '),
  ].join('\n'),

  test12: [ //mark 0,0 - try to uncover - move cursor right
    [s,c,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
    [s,s,s,s,s,s].join(' '),
  ].join('\n'),
};



module.exports  = {
  tests,
};
