var async = require('async');
var mongoose = require('mongoose');
var User = require('../src/server/models/user').model;
var Level = require('../src/server/models/level').model;

mongoose.connect(process.env.MONGODB_URL);

var email = 'tatsunami.qrostar@gmail.com';

/*
, {
    name: 'Level ',
    index: ,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }
*/

function createMove(x, y, left) {
  return {
    x: x,
    y: y,
    left: left
  };
}

var levels = [
  {
    name: 'Level 1',
    index: 1,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x             r           x ',
      'x             x x         x ',
      'x     g           r   b   x ',
      'x x b x x x g   x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(6, 6, false),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(5, 5, false),
      createMove(11, 5, true),
      createMove(10, 5, true),
      createMove(9, 5, true),
      createMove(8, 5, true),
      createMove(7, 3, true),
      createMove(7, 5, true),
      createMove(6, 5, true),
      createMove(5, 5, true),
      createMove(4, 5, true),
      createMove(3, 5, true)
    ]
  }, {
    name: 'Level 2',
    index: 2,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x           g       g     x ',
      'x       r   r       r     x ',
      'x x x x x   x   x   x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(6, 4, true),
      createMove(4, 5, false),
      createMove(5, 5, false),
      createMove(6, 5, false),
      createMove(7, 5, false),
      createMove(10, 4, true),
      createMove(9, 4, true),
      createMove(10, 5, true),
      createMove(9, 5, true),
      createMove(8, 4, true),
      createMove(7, 4, true),
      createMove(6, 4, true)
    ]
  }, {
    name: 'Level 3',
    index: 3,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x       b g     x   g     x ',
      'x x x   x x x r x x x     x ',
      'x             b           x ',
      'x x x   x x x r x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(5, 3, true),
      createMove(4, 3, true),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(5, 5, false),
      createMove(6, 5, false),
      createMove(8, 5, false),
      createMove(9, 5, false),
      createMove(10, 5, false),
      createMove(11, 5, false),
      createMove(10, 3, false),
      createMove(12, 5, true),
      createMove(11, 5, true),
      createMove(10, 5, true),
      createMove(9, 5, true),
      createMove(8, 5, true),
      createMove(7, 5, true),
      createMove(6, 5, true),
      createMove(5, 5, true),
      createMove(4, 5, true)
    ]
  }, {
    name: 'Level 4',
    index: 4,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x               r         x ',
      'x               b         x ',
      'x               x         x ',
      'x   b   r                 x ',
      'x   b   r             b   x ',
      'x x x   x             x x x ',
      'x x x x x   x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(11, 6, true),
      createMove(10, 7, true),
      createMove(9, 7, true),
      createMove(8, 3, true),
      createMove(8, 7, true),
      createMove(7, 7, true),
      createMove(4, 6, false),
      createMove(5, 6, false),
      createMove(6, 7, false),
      createMove(6, 6, false),
      createMove(7, 7, false),
      createMove(7, 6, false),
      createMove(8, 7, false),
      createMove(8, 6, false),
      createMove(9, 7, false),
      createMove(9, 6, false),
      createMove(10, 6, false),
      createMove(9, 7, true),
      createMove(8, 7, true),
      createMove(8, 3, true),
      createMove(7, 7, true),
      createMove(7, 6, true),
      createMove(6, 7, true),
      createMove(6, 6, true),
      createMove(5, 6, true),
      createMove(4, 6, true),
      createMove(6, 7, false),
      createMove(7, 7, false),
      createMove(8, 7, false),
      createMove(9, 7, false),
      createMove(11, 6, true),
      createMove(10, 6, true),
      createMove(9, 7, true),
      createMove(9, 6, true),
      createMove(8, 7, true),
      createMove(8, 6, true),
      createMove(7, 7, true),
      createMove(2, 5, false),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(7, 6, true),
      createMove(6, 6, true),
      createMove(5, 6, true),
      createMove(4, 6, true)
    ]
  }, {
    name: 'Level 5',
    index: 5,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x r g     g g             x ',
      'x x x   x x x x   x x     x ',
      'x r g                     x ',
      'x x x x x     x x       x x ',
      'x x x x x x   x x     x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(2, 5, false),
      createMove(3, 5, false),
      createMove(1, 3, false),
      createMove(3, 5, false),
      createMove(2, 3, false),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(5, 5, false),
      createMove(6, 5, false),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(1, 5, false),
      createMove(2, 5, false),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(5, 5, false),
      createMove(6, 5, false),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(9, 6, false),
      createMove(5, 3, false),
      createMove(6, 3, false),
      createMove(7, 3, false),
      createMove(8, 3, false),
      createMove(9, 3, false),
      createMove(10, 3, false),
      createMove(11, 5, true),
      createMove(10, 5, true),
      createMove(9, 5, true),
      createMove(8, 5, true),
      createMove(7, 5, true)
    ]
  }, {
    name: 'Level 6',
    index: 6,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x x x x             x ',
      'x x x x x x x   g         x ',
      'x               x x       x ',
      'x   r       b             x ',
      'x   x   x x x   x   g     x ',
      'x                   x   b x ',
      'x               r   x x x x ',
      'x       x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(8, 7, false),
      createMove(10, 5, true),
      createMove(9, 6, true),
      createMove(9, 7, true),
      createMove(8, 7, true),
      createMove(7, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true),
      createMove(4, 7, true),
      createMove(2, 4, false),
      createMove(3, 6, false),
      createMove(4, 6, false),
      createMove(5, 6, false),
      createMove(6, 6, false),
      createMove(8, 2, true),
      createMove(6, 4, false),
      createMove(7, 4, false),
      createMove(7, 6, false),
      createMove(8, 6, false),
      createMove(8, 4, false),
      createMove(9, 5, false),
      createMove(10, 5, false),
      createMove(7, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true),
      createMove(4, 7, true)
    ]
  }, {
    name: 'Level 7',
    index: 7,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                     r   x ',
      'x                     x   x ',
      'x           b       b     x ',
      'x           x     r r     x ',
      'x                   x     x ',
      'x   rb    bbx   x   x     x ',
      'x   x     x x   x   x     x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(10, 5, true),
      createMove(10, 5, true),
      createMove(9, 5, true),
      createMove(9, 6, true),
      createMove(6, 4, false),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(8, 6, true),
      createMove(11, 2, true),
      createMove(10, 4, true),
      createMove(9, 4, true),
      createMove(8, 6, true),
      createMove(10, 5, true),
      createMove(9, 6, true),
      createMove(8, 6, true),
      createMove(7, 6, true)
    ]
  }, {
    name: 'Level 8',
    index: 8,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x   x     x   x x x x ',
      'x x x     g     b     x x x ',
      'x x       x     x       x x ',
      'x x       bt    gt      x x ',
      'x x g                 b x x ',
      'x x x g             b x x x ',
      'x x x x             x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(3, 6, false),
      createMove(4, 7, false),
      createMove(5, 7, false),
      createMove(6, 7, false),
      createMove(7, 7, false),
      createMove(8, 7, false),
      createMove(10, 6, true),
      createMove(11, 5, true),
      createMove(10, 6, true),
      createMove(9, 7, true),
      createMove(9, 6, true),
      createMove(8, 7, true),
      createMove(8, 6, true),
      createMove(7, 7, true),
      createMove(7, 6, true),
      createMove(6, 7, true),
      createMove(6, 6, true),
      createMove(5, 7, true),
      createMove(5, 6, true),
      createMove(2, 5, false),
      createMove(3, 5, false),
      createMove(3, 6, false),
      createMove(4, 5, false),
      createMove(4, 7, false),
      createMove(4, 6, false),
      createMove(5, 5, false),
      createMove(5, 7, false),
      createMove(5, 6, false),
      createMove(6, 5, false),
      createMove(6, 7, false),
      createMove(6, 6, false),
      createMove(7, 5, false),
      createMove(8, 2, true),
      createMove(7, 6, true),
      createMove(7, 7, true),
      createMove(6, 6, true),
      createMove(6, 7, false),
      createMove(5, 2, false),
      createMove(6, 5, false),
      createMove(7, 6, false)
    ]
  }, {
    name: 'Level 9',
    index: 9,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                     r b x ',
      'x         x           x x x ',
      'x b                 l l x x ',
      'x x     rbx     x   x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(11, 7, true),
      createMove(12, 5, true),
      createMove(11, 5, true),
      createMove(10, 5, true),
      createMove(9, 6, true),
      createMove(8, 7, true),
      createMove(10, 6, true),
      createMove(9, 7, true),
      createMove(9, 6, true),
      createMove(8, 7, true),
      createMove(8, 6, true),
      createMove(7, 7, true),
      createMove(6, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true),
      createMove(4, 7, true),
      createMove(1, 7, false),
      createMove(2, 7, false),
      createMove(3, 7, false),
      createMove(4, 7, false),
      createMove(5, 7, false),
      createMove(7, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true)
    ]
  }, {
    name: 'Level 10',
    index: 10,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x       g r               x ',
      'x       0 0   1           x ',
      'x         x   x   x x x x x ',
      'x                         x ',
      'x     x     x             x ',
      'x                 x     rbx ',
      'x x       x           gbx x ',
      'x                     x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(7, 2, true),
      createMove(6, 4, true),
      createMove(5, 2, true),
      createMove(4, 4, false),
      createMove(4, 4, false),
      createMove(5, 4, false),
      createMove(5, 6, false),
      createMove(6, 8, false),
      createMove(6, 4, false),
      createMove(5, 6, false),
      createMove(6, 6, false),
      createMove(7, 6, false),
      createMove(5, 2, false),
      createMove(6, 4, false),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(8, 6, true),
      createMove(7, 6, true),
      createMove(6, 6, true),
      createMove(5, 6, true),
      createMove(3, 8, false),
      createMove(4, 8, false),
      createMove(5, 8, false),
      createMove(6, 8, false),
      createMove(7, 7, false),
      createMove(8, 7, false),
      createMove(7, 8, false),
      createMove(9, 7, false),
      createMove(9, 5, false),
      createMove(10, 6, false)
    ]
  }, {
    name: 'Level 11',
    index: 11,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x             yr0 0 yl  y x ',
      'x               x x x   x x ',
      'x                       y x ',
      'x 1 1                   x x ',
      'x x x                     x ',
      'x               y         x ',
      'x       x   x x x       ybx ',
      'x       x x x x x x   x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(8, 6, true),
      createMove(7, 6, true),
      createMove(9, 1, true),
      createMove(8, 1, true),
      createMove(7, 1, true),
      createMove(2, 4, false),
      createMove(3, 4, false),
      createMove(4, 4, false),
      createMove(5, 4, false),
      createMove(6, 4, false),
      createMove(7, 4, false),
      createMove(6, 5, false),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(8, 4, false),
      createMove(9, 4, false),
      createMove(10, 4, false),
      createMove(12, 1, true),
      createMove(10, 4, true),
      createMove(9, 4, true),
      createMove(9, 5, true),
      createMove(11, 3, true),
      createMove(7, 5, false),
      createMove(8, 5, false),
      createMove(9, 5, false)
    ]
  }, {
    name: 'Level 12',
    index: 12,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x r   r r     r r   r x x ',
      'x x x     x     x     x x x ',
      'x                         x ',
      'x b                     bbx ',
      'x x                     x x ',
      'x                         x ',
      'x                         x ',
      'x       x x x x x x       x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(11, 1, true),
      createMove(9, 1, true),
      createMove(7, 1, true),
      createMove(6, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true),
      createMove(2, 1, false),
      createMove(4, 7, false),
      createMove(4, 1, true),
      createMove(4, 5, true),
      createMove(1, 4, false),
      createMove(2, 4, false),
      createMove(3, 5, false),
      createMove(3, 4, false),
      createMove(4, 5, false),
      createMove(4, 4, false),
      createMove(5, 5, false),
      createMove(5, 4, false),
      createMove(6, 5, false),
      createMove(6, 4, false),
      createMove(7, 5, false),
      createMove(7, 4, false),
      createMove(8, 5, false),
      createMove(8, 4, false),
      createMove(9, 5, false),
      createMove(9, 4, false),
      createMove(10, 5, false),
      createMove(10, 4, false)
    ]
  }, {
    name: 'Level 13',
    index: 13,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x   y r   x x x x x ',
      'x x x x x   r b   x x x x x ',
      'x x x x x   y r   x x x x x ',
      'x x x x x   b y   x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(7, 3, false),
      createMove(6, 6, true),
      createMove(7, 5, false),
      createMove(7, 4, true),
      createMove(6, 4, true)
    ]
  }, {
    name: 'Level 14',
    index: 14,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x       r x ',
      'x x x x x x x x x       g x ',
      'x x x x x x x x x       g x ',
      'x 0 0 1 1               g x ',
      'x 0 0 1 1               g x ',
      'x 2 2 3 3             x x x ',
      'x 2 2 3 3             x x x ',
      'x x rb  x   gbx x x   x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(4, 6, false),
      createMove(4, 4, false),
      createMove(5, 6, false),
      createMove(5, 4, false),
      createMove(6, 7, false),
      createMove(6, 4, false),
      createMove(7, 6, false),
      createMove(7, 4, false),
      createMove(8, 6, false),
      createMove(8, 4, false),
      createMove(9, 6, false),
      createMove(9, 5, false),
      createMove(10, 4, false),
      createMove(12, 1, true),
      createMove(11, 3, true),
      createMove(10, 3, true),
      createMove(9, 6, true),
      createMove(9, 5, true),
      createMove(8, 6, true),
      createMove(8, 5, true),
      createMove(7, 6, true),
      createMove(7, 5, true),
      createMove(6, 6, true),
      createMove(6, 5, true),
      createMove(5, 6, true),
      createMove(5, 5, true),
      createMove(4, 5, true),
      createMove(5, 7, false),
      createMove(6, 6, false),
      createMove(7, 6, false),
      createMove(8, 6, false),
      createMove(8, 6, false),
      createMove(10, 5, true),
      createMove(10, 5, true),
      createMove(9, 6, true),
      createMove(9, 4, true),
      createMove(8, 6, true),
      createMove(8, 5, true),
      createMove(7, 6, true),
      createMove(7, 5, true),
      createMove(6, 6, true),
      createMove(6, 5, true),
      createMove(5, 6, true),
      createMove(5, 5, true),
      createMove(2, 7, false),
      createMove(5, 6, false),
      createMove(6, 6, false),
      createMove(7, 6, false),
      createMove(8, 6, false),
      createMove(9, 6, false),
      createMove(12, 4, true),
      createMove(11, 4, true),
      createMove(10, 4, true),
      createMove(9, 7, true),
      createMove(9, 7, true),
      createMove(9, 7, true),
      createMove(8, 7, true),
      createMove(7, 7, true)
    ]
  }, {
    name: 'Level 15',
    index: 15,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x r   r   r             r x ',
      'x g   x   x             g x ',
      'x bb                    b x ',
      'x x x x x           x x x x ',
      'x x x x x x       x x x x x ',
      'x x x x x x       x x x x x ',
      'x x x x x x       x x x x x ',
      'x x x x x x glg grx x x x x ',
      'x x x x x x       x x x x x '
    ],
    solution: [
      createMove(12, 2, true),
      createMove(11, 3, true),
      createMove(12, 2, true),
      createMove(11, 3, true),
      createMove(9, 4, true),
      createMove(10, 3, true),
      createMove(9, 4, true),
      createMove(5, 1, true),
      createMove(3, 1, true),
      createMove(2, 3, false),
      createMove(1, 1, false),
      createMove(2, 3, false),
      createMove(1, 2, false),
      createMove(2, 3, false),
      createMove(3, 3, false),
      createMove(4, 3, false),
      createMove(5, 3, false),
      createMove(6, 3, false),
      createMove(7, 3, false),
      createMove(7, 4, false),
      createMove(8, 4, false),
      createMove(12, 3, true),
      createMove(11, 3, true),
      createMove(10, 3, true),
      createMove(9, 3, true),
      createMove(8, 3, true),
      createMove(7, 4, true),
      createMove(7, 4, true),
      createMove(7, 3, true),
      createMove(6, 3, true),
      createMove(5, 3, true),
      createMove(4, 3, true),
      createMove(3, 3, true),
      createMove(7, 4, false),
      createMove(8, 5, true)
    ]
  }, {
    name: 'Level 16',
    index: 16,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x       0 0 0 1 2 3 3 r x ',
      'x x       0 4 1 1 2 3 3 x x ',
      'x x       4 4 4 1 2 2 x x x ',
      'x x           x x x x x x x ',
      'x rt          x x x x x x x ',
      'x x           x x x x x x x ',
      'x x           x x x x x x x ',
      'x x           x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(7, 3, true),
      createMove(8, 2, true),
      createMove(7, 2, true),
      createMove(6, 4, true),
      createMove(5, 4, true),
      createMove(6, 8, true),
      createMove(5, 8, true),
      createMove(12, 1, true),
      createMove(11, 2, true),
      createMove(10, 3, true),
      createMove(9, 3, true),
      createMove(8, 3, true),
      createMove(4, 4, false),
      createMove(5, 4, false),
      createMove(7, 3, true),
      createMove(6, 3, true),
      createMove(5, 4, true),
      createMove(4, 5, true),
      createMove(3, 5, true)
    ]
  }, {
    name: 'Level 17',
    index: 17,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x 0 0 0 x x x g b   x ',
      'x x x x 0           b g   x ',
      'x x x x 0         1 1 x x x ',
      'x x x x 0 0 0 x x x x x x x ',
      'x   2 2 2     x x x x x x x ',
      'x x x x           x x gtx x ',
      'x x x x       g         btx ',
      'x x x x       x           x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(10, 2, true),
      createMove(9, 3, true),
      createMove(9, 2, true),
      createMove(9, 3, true),
      createMove(8, 2, true),
      createMove(7, 3, true),
      createMove(3, 5, false),
      createMove(4, 5, false),
      createMove(7, 7, true),
      createMove(6, 7, true),
      createMove(5, 7, true),
      createMove(7, 3, false),
      createMove(5, 6, false),
      createMove(6, 6, false),
      createMove(7, 2, true),
      createMove(6, 2, true),
      createMove(5, 7, false),
      createMove(11, 2, false),
      createMove(11, 1, true),
      createMove(12, 2, true),
      createMove(10, 2, true),
      createMove(9, 2, true),
      createMove(9, 2, true),
      createMove(7, 2, true),
      createMove(4, 7, false),
      createMove(5, 7, false),
      createMove(7, 2, true),
      createMove(6, 2, true),
      createMove(5, 7, false),
      createMove(6, 7, false),
      createMove(7, 7, false),
      createMove(8, 7, false),
      createMove(9, 7, false),
      createMove(9, 8, false),
      createMove(10, 8, false),
      createMove(10, 8, false)
    ]
  }, {
    name: 'Level 18',
    index: 18,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x b 0 1                   x ',
      'x b 0 y y           y     x ',
      'x b 0 2 3           y 4 bbx ',
      'x x x x x   y       x x x x ',
      'x x x x x   y y     x x x x ',
      'x x x x x   y y y   x x x x ',
      'x x x x x   y y y y x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(10, 4, true),
      createMove(9, 7, true),
      createMove(3, 2, false),
      createMove(3, 4, false),
      createMove(3, 3, false),
      createMove(4, 2, false),
      createMove(4, 3, false),
      createMove(4, 4, false),
      createMove(5, 2, false),
      createMove(5, 4, false),
      createMove(5, 3, false),
      createMove(6, 2, false),
      createMove(6, 5, false),
      createMove(6, 5, false),
      createMove(6, 4, false),
      createMove(7, 3, false),
      createMove(7, 5, false),
      createMove(6, 8, false),
      createMove(8, 4, false),
      createMove(8, 5, false),
      createMove(8, 3, false),
      createMove(8, 4, false),
      createMove(9, 3, false),
      createMove(10, 3, false),
      createMove(11, 3, false),
      createMove(11, 4, true),
      createMove(10, 4, true),
      createMove(9, 5, true),
      createMove(1, 3, false),
      createMove(2, 3, false),
      createMove(3, 3, false),
      createMove(4, 3, false),
      createMove(5, 3, false),
      createMove(6, 3, false),
      createMove(7, 3, false),
      createMove(8, 3, false),
      createMove(9, 3, false),
      createMove(10, 3, false)
    ]
  }, {
    name: 'Level 19',
    index: 19,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x gr0         gr2 glx     x ',
      'x   1 gl        2   x     x ',
      'x 3 3 3         4   x     x ',
      'x gt  gt      g gtg       x ',
      'x x x           x x x     x ',
      'x x x           x x x     x ',
      'x x x           x x x     x ',
      'x x x                     x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(2, 2, false),
      createMove(3, 2, false),
      createMove(8, 2, true),
      createMove(8, 3, true),
      createMove(3, 3, false),
      createMove(6, 3, true),
      createMove(7, 3, false),
      createMove(3, 3, true),
      createMove(5, 6, false),
      createMove(8, 3, true),
      createMove(7, 3, true),
      createMove(6, 5, true),
      createMove(2, 2, false),
      createMove(3, 2, false),
      createMove(3, 3, false),
      createMove(4, 3, false),
      createMove(4, 3, false),
      createMove(4, 3, false),
      createMove(5, 3, false),
      createMove(6, 3, false),
      createMove(7, 3, false),
      createMove(8, 4, false),
      createMove(9, 4, false),
      createMove(10, 4, false),
      createMove(11, 4, false),
      createMove(11, 8, true),
      createMove(11, 8, true),
      createMove(10, 8, true),
      createMove(9, 8, true),
      createMove(8, 8, true)
    ]
  }, {
    name: 'Level 20',
    index: 20,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x r r r r       r g g x x x ',
      'x x x b         x x x x x x ',
      'x x x x               x btx ',
      'x x                       x ',
      'x x                       x ',
      'x x           x           x ',
      'x x   x                   x ',
      'x x                 x     x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createMove(3, 1, false),
      createMove(4, 1, false),
      createMove(5, 1, false),
      createMove(7, 5, false),
      createMove(10, 1, true),
      createMove(8, 1, true),
      createMove(8, 1, true),
      createMove(7, 3, true),
      createMove(8, 5, true),
      createMove(3, 2, false),
      createMove(4, 3, false),
      createMove(4, 4, false),
      createMove(5, 3, false),
      createMove(5, 4, false),
      createMove(6, 3, false),
      createMove(6, 4, false),
      createMove(7, 3, false),
      createMove(9, 5, false),
      createMove(10, 7, true),
      createMove(8, 5, false),
      createMove(8, 4, false),
      createMove(9, 5, false),
      createMove(9, 6, false),
      createMove(9, 4, false),
      createMove(10, 5, false),
      createMove(10, 6, false),
      createMove(10, 4, false),
      createMove(11, 5, false),
      createMove(11, 4, false)
    ]
  }, {
    name: 'Level 21',
    index: 21,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x             x           x ',
      'x             x           x ',
      'x             x           x ',
      'x             gt          x ',
      'x                 g b     x ',
      'x x x x           x x     x ',
      'x x x r   b           r   x ',
      'x x x x   x x xrx x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }, {
    name: 'Level 22',
    index: 22,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x         g     b g r     x ',
      'x   x   x x     x x x   x x ',
      'x b x                     x ',
      'x x x x x x xRx x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }, {
    name: 'Level 23',
    index: 23,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x         g               x ',
      'x         b               x ',
      'x         x         r     x ',
      'x                 x x     x ',
      'x   b                     x ',
      'x x x x   r   x xrx   x g x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }, {
    name: 'Level 24',
    index: 24,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x g       b           x x x ',
      'x r       g           x x x ',
      'x yb      b   y       y x x ',
      'x x       x   x       x x x ',
      'x x x x               x x x ',
      'x x x x               x x x ',
      'x x x x xgx   x x xRx x x x ',
      'x x x x x x gbx x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }, {
    name: 'Level 25',
    index: 25,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x     x     x ',
      'x x x x x x x x     rt    x ',
      'x x x x x x x x           x ',
      'x x x x x           r     x ',
      'x x 0 0 0         1 1 1   x ',
      'x   0 0 0         1 1 1   x ',
      'x   g                 x   x ',
      'x x x x xgx x xgx x xgx x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
    ]
  }, {
    name: 'Level 26',
    index: 26,
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x                 x x x x ',
      'x x     r           x x x x ',
      'x x 0 0 0 0 0 0r0 0 x x x x ',
      'x x           r       x x x ',
      'x x 1 1 1r1 1 1 1 1   x x x ',
      'x x     r             x x x ',
      'x x 2 2 2 2 2 2r2 2 x x x x ',
      'x x           r     x x x x ',
      'x x x x xrx x x x x x x x x '
    ],
    solution: [
    ]
  }
];

function createLevels(user, callback) {
  var author = user.id.toString();
  levels.forEach(function(level) {
    var moves = level.solution.length;
    level.author = author;
    level.layout = JSON.stringify(level.layout);
    level.solution = JSON.stringify(level.solution);
    level.moves = moves;
  });
  async.forEachSeries(levels, function(levelData, asyncCallback) {
    Level.findOne({
      author: author,
      name: levelData.name
    }, function(err, level) {
      if (err) {
        return asyncCallback(err);
      }
      if (!level) {
        level = new Level({
          moves: 0,
          solution: JSON.stringify([])
        });
      }
      if ((levelData.moves === 0) || ((level.moves > 0) && (level.moves < levelData.moves))) {
        delete levelData.solution;
        delete levelData.moves;
      }
      for (var key in levelData) {
        if (levelData.hasOwnProperty(key)) {
          level[key] = levelData[key];
        }
      }
      level.save(asyncCallback);
    });
  }, callback);
}

function createUser(callback) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err || user) {
      return callback(err, user);
    }
    user = new User({
      email: email
    });
    user.save(function(err) {
      callback(err, user);
    });
  });
}

createUser(function(err, user) {
  if (err) {
    throw err;
  }
  createLevels(user, function(err) {
    if (err) {
      throw err;
    }
    process.exit(0);
  });
});
