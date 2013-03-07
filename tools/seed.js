var async = require('async');
var mongoose = require('mongoose');
var User = require('../src/server/models/user').model;
var Level = require('../src/server/models/level').model;

mongoose.connect(process.env.MONGODB_URL);

var email = 'tatsunami.qrostar@gmail.com';

function createClick(x, y, left) {
  return {
    x: x,
    y: y,
    left: left
  };
}

var levels = [
  {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x             r           x ',
      'x             x x         x ',
      'x     g           r   b   x ',
      'x x b x x x g   x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(6, 6, false),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(5, 5, false),
      createClick(11, 5, true),
      createClick(10, 5, true),
      createClick(9, 5, true),
      createClick(8, 5, true),
      createClick(7, 3, true),
      createClick(7, 5, true),
      createClick(6, 5, true),
      createClick(5, 5, true),
      createClick(4, 5, true),
      createClick(3, 5, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x                         x ',
      'x           g       g     x ',
      'x       r   r       r     x ',
      'x x x x x   x   x   x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(6, 4, true),
      createClick(4, 5, false),
      createClick(5, 5, false),
      createClick(6, 5, false),
      createClick(7, 5, false),
      createClick(10, 4, true),
      createClick(9, 4, true),
      createClick(10, 5, true),
      createClick(9, 5, true),
      createClick(8, 4, true),
      createClick(7, 4, true),
      createClick(6, 4, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x                         x ',
      'x       b g     x   g     x ',
      'x x x   x x x r x x x     x ',
      'x             b           x ',
      'x x x   x x x r x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(5, 3, true),
      createClick(4, 3, true),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(5, 5, false),
      createClick(6, 5, false),
      createClick(8, 5, false),
      createClick(9, 5, false),
      createClick(10, 5, false),
      createClick(11, 5, false),
      createClick(10, 3, false),
      createClick(12, 5, true),
      createClick(11, 5, true),
      createClick(10, 5, true),
      createClick(9, 5, true),
      createClick(8, 5, true),
      createClick(7, 5, true),
      createClick(6, 5, true),
      createClick(5, 5, true),
      createClick(4, 5, true)
    ]
  }, {
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
      createClick(11, 6, true),
      createClick(10, 7, true),
      createClick(9, 7, true),
      createClick(8, 3, true),
      createClick(8, 7, true),
      createClick(7, 7, true),
      createClick(4, 6, false),
      createClick(5, 6, false),
      createClick(6, 7, false),
      createClick(6, 6, false),
      createClick(7, 7, false),
      createClick(7, 6, false),
      createClick(8, 7, false),
      createClick(8, 6, false),
      createClick(9, 7, false),
      createClick(9, 6, false),
      createClick(10, 6, false),
      createClick(9, 7, true),
      createClick(8, 7, true),
      createClick(8, 3, true),
      createClick(7, 7, true),
      createClick(7, 6, true),
      createClick(6, 7, true),
      createClick(6, 6, true),
      createClick(5, 6, true),
      createClick(4, 6, true),
      createClick(6, 7, false),
      createClick(7, 7, false),
      createClick(8, 7, false),
      createClick(9, 7, false),
      createClick(11, 6, true),
      createClick(10, 6, true),
      createClick(9, 7, true),
      createClick(9, 6, true),
      createClick(8, 7, true),
      createClick(8, 6, true),
      createClick(7, 7, true),
      createClick(2, 5, false),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(7, 6, true),
      createClick(6, 6, true),
      createClick(5, 6, true),
      createClick(4, 6, true)
    ]
  }, {
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
      createClick(2, 5, false),
      createClick(3, 5, false),
      createClick(1, 3, false),
      createClick(3, 5, false),
      createClick(2, 3, false),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(5, 5, false),
      createClick(6, 5, false),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(1, 5, false),
      createClick(2, 5, false),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(5, 5, false),
      createClick(6, 5, false),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(9, 6, false),
      createClick(5, 3, false),
      createClick(6, 3, false),
      createClick(7, 3, false),
      createClick(8, 3, false),
      createClick(9, 3, false),
      createClick(10, 3, false),
      createClick(11, 5, true),
      createClick(10, 5, true),
      createClick(9, 5, true),
      createClick(8, 5, true),
      createClick(7, 5, true)
    ]
  }, {
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
      createClick(8, 7, false),
      createClick(10, 5, true),
      createClick(9, 6, true),
      createClick(9, 7, true),
      createClick(8, 7, true),
      createClick(7, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true),
      createClick(4, 7, true),
      createClick(2, 4, false),
      createClick(3, 6, false),
      createClick(4, 6, false),
      createClick(5, 6, false),
      createClick(6, 6, false),
      createClick(8, 2, true),
      createClick(6, 4, false),
      createClick(7, 4, false),
      createClick(7, 6, false),
      createClick(8, 6, false),
      createClick(8, 4, false),
      createClick(9, 5, false),
      createClick(10, 5, false),
      createClick(7, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true),
      createClick(4, 7, true)
    ]
  }, {
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
      createClick(10, 5, true),
      createClick(10, 5, true),
      createClick(9, 5, true),
      createClick(9, 6, true),
      createClick(6, 4, false),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(8, 6, true),
      createClick(11, 2, true),
      createClick(10, 4, true),
      createClick(9, 4, true),
      createClick(8, 6, true),
      createClick(10, 5, true),
      createClick(9, 6, true),
      createClick(8, 6, true),
      createClick(7, 6, true)
    ]
  }, {
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
      createClick(3, 6, false),
      createClick(4, 7, false),
      createClick(5, 7, false),
      createClick(6, 7, false),
      createClick(7, 7, false),
      createClick(8, 7, false),
      createClick(10, 6, true),
      createClick(11, 5, true),
      createClick(10, 6, true),
      createClick(9, 7, true),
      createClick(9, 6, true),
      createClick(8, 7, true),
      createClick(8, 6, true),
      createClick(7, 7, true),
      createClick(7, 6, true),
      createClick(6, 7, true),
      createClick(6, 6, true),
      createClick(5, 7, true),
      createClick(5, 6, true),
      createClick(2, 5, false),
      createClick(3, 5, false),
      createClick(3, 6, false),
      createClick(4, 5, false),
      createClick(4, 7, false),
      createClick(4, 6, false),
      createClick(5, 5, false),
      createClick(5, 7, false),
      createClick(5, 6, false),
      createClick(6, 5, false),
      createClick(6, 7, false),
      createClick(6, 6, false),
      createClick(7, 5, false),
      createClick(8, 2, true),
      createClick(7, 6, true),
      createClick(7, 7, true),
      createClick(6, 6, true),
      createClick(6, 7, false),
      createClick(5, 2, false),
      createClick(6, 5, false),
      createClick(7, 6, false)
    ]
  }, {
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
      createClick(11, 7, true),
      createClick(12, 5, true),
      createClick(11, 5, true),
      createClick(10, 5, true),
      createClick(9, 6, true),
      createClick(8, 7, true),
      createClick(10, 6, true),
      createClick(9, 7, true),
      createClick(9, 6, true),
      createClick(8, 7, true),
      createClick(8, 6, true),
      createClick(7, 7, true),
      createClick(6, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true),
      createClick(4, 7, true),
      createClick(1, 7, false),
      createClick(2, 7, false),
      createClick(3, 7, false),
      createClick(4, 7, false),
      createClick(5, 7, false),
      createClick(7, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x       g r               x ',
      'x       l0l0  l1          x ',
      'x         x   x   x x x x x ',
      'x                         x ',
      'x     x     x             x ',
      'x                 x     rbx ',
      'x x       x           gbx x ',
      'x                     x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(7, 2, true),
      createClick(6, 4, true),
      createClick(5, 2, true),
      createClick(4, 4, false),
      createClick(4, 4, false),
      createClick(5, 4, false),
      createClick(5, 6, false),
      createClick(6, 8, false),
      createClick(6, 4, false),
      createClick(5, 6, false),
      createClick(6, 6, false),
      createClick(7, 6, false),
      createClick(5, 2, false),
      createClick(6, 4, false),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(8, 6, true),
      createClick(7, 6, true),
      createClick(6, 6, true),
      createClick(5, 6, true),
      createClick(3, 8, false),
      createClick(4, 8, false),
      createClick(5, 8, false),
      createClick(6, 8, false),
      createClick(7, 7, false),
      createClick(8, 7, false),
      createClick(7, 8, false),
      createClick(9, 7, false),
      createClick(9, 5, false),
      createClick(10, 6, false)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x             yrl0l0yl  y x ',
      'x               x x x   x x ',
      'x                       y x ',
      'x l1l1                  x x ',
      'x x x                     x ',
      'x               y         x ',
      'x       x   x x x       ybx ',
      'x       x x x x x x   x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(8, 6, true),
      createClick(7, 6, true),
      createClick(9, 1, true),
      createClick(8, 1, true),
      createClick(7, 1, true),
      createClick(2, 4, false),
      createClick(3, 4, false),
      createClick(4, 4, false),
      createClick(5, 4, false),
      createClick(6, 4, false),
      createClick(7, 4, false),
      createClick(6, 5, false),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(8, 4, false),
      createClick(9, 4, false),
      createClick(10, 4, false),
      createClick(12, 1, true),
      createClick(10, 4, true),
      createClick(9, 4, true),
      createClick(9, 5, true),
      createClick(11, 3, true),
      createClick(7, 5, false),
      createClick(8, 5, false),
      createClick(9, 5, false)
    ]
  }, {
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
      createClick(11, 1, true),
      createClick(9, 1, true),
      createClick(7, 1, true),
      createClick(6, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true),
      createClick(2, 1, false),
      createClick(4, 7, false),
      createClick(4, 1, true),
      createClick(4, 5, true),
      createClick(1, 4, false),
      createClick(2, 4, false),
      createClick(3, 5, false),
      createClick(3, 4, false),
      createClick(4, 5, false),
      createClick(4, 4, false),
      createClick(5, 5, false),
      createClick(5, 4, false),
      createClick(6, 5, false),
      createClick(6, 4, false),
      createClick(7, 5, false),
      createClick(7, 4, false),
      createClick(8, 5, false),
      createClick(8, 4, false),
      createClick(9, 5, false),
      createClick(9, 4, false),
      createClick(10, 5, false),
      createClick(10, 4, false)
    ]
  }, {
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
      createClick(7, 3, false),
      createClick(6, 6, true),
      createClick(7, 5, false),
      createClick(7, 4, true),
      createClick(6, 4, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x x x x x x       r x ',
      'x x x x x x x x x       g x ',
      'x x x x x x x x x       g x ',
      'x l0l0l1l1              g x ',
      'x l0l0l1l1              g x ',
      'x l2l2l3l3            x x x ',
      'x l2l2l3l3            x x x ',
      'x x rb  x   gbx x x   x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(4, 6, false),
      createClick(4, 4, false),
      createClick(5, 6, false),
      createClick(5, 4, false),
      createClick(6, 7, false),
      createClick(6, 4, false),
      createClick(7, 6, false),
      createClick(7, 4, false),
      createClick(8, 6, false),
      createClick(8, 4, false),
      createClick(9, 6, false),
      createClick(9, 5, false),
      createClick(10, 4, false),
      createClick(12, 1, true),
      createClick(11, 3, true),
      createClick(10, 3, true),
      createClick(9, 6, true),
      createClick(9, 5, true),
      createClick(8, 6, true),
      createClick(8, 5, true),
      createClick(7, 6, true),
      createClick(7, 5, true),
      createClick(6, 6, true),
      createClick(6, 5, true),
      createClick(5, 6, true),
      createClick(5, 5, true),
      createClick(4, 5, true),
      createClick(5, 7, false),
      createClick(6, 6, false),
      createClick(7, 6, false),
      createClick(8, 6, false),
      createClick(8, 6, false),
      createClick(10, 5, true),
      createClick(10, 5, true),
      createClick(9, 6, true),
      createClick(9, 4, true),
      createClick(8, 6, true),
      createClick(8, 5, true),
      createClick(7, 6, true),
      createClick(7, 5, true),
      createClick(6, 6, true),
      createClick(6, 5, true),
      createClick(5, 6, true),
      createClick(5, 5, true),
      createClick(2, 7, false),
      createClick(5, 6, false),
      createClick(6, 6, false),
      createClick(7, 6, false),
      createClick(8, 6, false),
      createClick(9, 6, false),
      createClick(12, 4, true),
      createClick(11, 4, true),
      createClick(10, 4, true),
      createClick(9, 7, true),
      createClick(9, 7, true),
      createClick(9, 7, true),
      createClick(8, 7, true),
      createClick(7, 7, true)
    ]
  }, {
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
      createClick(12, 2, true),
      createClick(11, 3, true),
      createClick(12, 2, true),
      createClick(11, 3, true),
      createClick(9, 4, true),
      createClick(10, 3, true),
      createClick(9, 4, true),
      createClick(5, 1, true),
      createClick(3, 1, true),
      createClick(2, 3, false),
      createClick(1, 1, false),
      createClick(2, 3, false),
      createClick(1, 2, false),
      createClick(2, 3, false),
      createClick(3, 3, false),
      createClick(4, 3, false),
      createClick(5, 3, false),
      createClick(6, 3, false),
      createClick(7, 3, false),
      createClick(7, 4, false),
      createClick(8, 4, false),
      createClick(12, 3, true),
      createClick(11, 3, true),
      createClick(10, 3, true),
      createClick(9, 3, true),
      createClick(8, 3, true),
      createClick(7, 4, true),
      createClick(7, 4, true),
      createClick(7, 3, true),
      createClick(6, 3, true),
      createClick(5, 3, true),
      createClick(4, 3, true),
      createClick(3, 3, true),
      createClick(7, 4, false),
      createClick(8, 5, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x       l0l0l0l1l2l3l3r x ',
      'x x       l0l4l1l1l2l3l3x x ',
      'x x       l4l4l4l1l2l2x x x ',
      'x x           x x x x x x x ',
      'x rt          x x x x x x x ',
      'x x           x x x x x x x ',
      'x x           x x x x x x x ',
      'x x           x x x x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(7, 3, true),
      createClick(8, 2, true),
      createClick(7, 2, true),
      createClick(6, 4, true),
      createClick(5, 4, true),
      createClick(6, 8, true),
      createClick(5, 8, true),
      createClick(12, 1, true),
      createClick(11, 2, true),
      createClick(10, 3, true),
      createClick(9, 3, true),
      createClick(8, 3, true),
      createClick(4, 4, false),
      createClick(5, 4, false),
      createClick(7, 3, true),
      createClick(6, 3, true),
      createClick(5, 4, true),
      createClick(4, 5, true),
      createClick(3, 5, true)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x x x x l0l0l0x x x g b   x ',
      'x x x x l0          b g   x ',
      'x x x x l0        l1l1x x x ',
      'x x x x l0l0l0x x x x x x x ',
      'x   l2l2l2    x x x x x x x ',
      'x x x x           x x gtx x ',
      'x x x x       g         btx ',
      'x x x x       x           x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(10, 2, true),
      createClick(9, 3, true),
      createClick(9, 2, true),
      createClick(9, 3, true),
      createClick(8, 2, true),
      createClick(7, 3, true),
      createClick(3, 5, false),
      createClick(4, 5, false),
      createClick(7, 7, true),
      createClick(6, 7, true),
      createClick(5, 7, true),
      createClick(7, 3, false),
      createClick(5, 6, false),
      createClick(6, 6, false),
      createClick(7, 2, true),
      createClick(6, 2, true),
      createClick(5, 7, false),
      createClick(11, 2, false),
      createClick(11, 1, true),
      createClick(12, 2, true),
      createClick(10, 2, true),
      createClick(9, 2, true),
      createClick(9, 2, true),
      createClick(7, 2, true),
      createClick(4, 7, false),
      createClick(5, 7, false),
      createClick(7, 2, true),
      createClick(6, 2, true),
      createClick(5, 7, false),
      createClick(6, 7, false),
      createClick(7, 7, false),
      createClick(8, 7, false),
      createClick(9, 7, false),
      createClick(9, 8, false),
      createClick(10, 8, false),
      createClick(10, 8, false)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x                         x ',
      'x b l0l1                  x ',
      'x b l0y y           y     x ',
      'x b l0l2l3          y l4bbx ',
      'x x x x x   y       x x x x ',
      'x x x x x   y y     x x x x ',
      'x x x x x   y y y   x x x x ',
      'x x x x x   y y y y x x x x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(10, 4, true),
      createClick(9, 7, true),
      createClick(3, 2, false),
      createClick(3, 4, false),
      createClick(3, 3, false),
      createClick(4, 2, false),
      createClick(4, 3, false),
      createClick(4, 4, false),
      createClick(5, 2, false),
      createClick(5, 4, false),
      createClick(5, 3, false),
      createClick(6, 2, false),
      createClick(6, 5, false),
      createClick(6, 5, false),
      createClick(6, 4, false),
      createClick(7, 3, false),
      createClick(7, 5, false),
      createClick(6, 8, false),
      createClick(8, 4, false),
      createClick(8, 5, false),
      createClick(8, 3, false),
      createClick(8, 4, false),
      createClick(9, 3, false),
      createClick(10, 3, false),
      createClick(11, 3, false),
      createClick(11, 4, true),
      createClick(10, 4, true),
      createClick(9, 5, true),
      createClick(1, 3, false),
      createClick(2, 3, false),
      createClick(3, 3, false),
      createClick(4, 3, false),
      createClick(5, 3, false),
      createClick(6, 3, false),
      createClick(7, 3, false),
      createClick(8, 3, false),
      createClick(9, 3, false),
      createClick(10, 3, false)
    ]
  }, {
    layout: [
      'x x x x x x x x x x x x x x ',
      'x grl0        grl2glx     x ',
      'x   l1gl        l2  x     x ',
      'x l3l3l3        l4  x     x ',
      'x gt  gt      g gtg       x ',
      'x x x           x x x     x ',
      'x x x           x x x     x ',
      'x x x           x x x     x ',
      'x x x                     x ',
      'x x x x x x x x x x x x x x '
    ],
    solution: [
      createClick(2, 2, false),
      createClick(3, 2, false),
      createClick(8, 2, true),
      createClick(8, 3, true),
      createClick(3, 3, false),
      createClick(6, 3, true),
      createClick(7, 3, false),
      createClick(3, 3, true),
      createClick(5, 6, false),
      createClick(8, 3, true),
      createClick(7, 3, true),
      createClick(6, 5, true),
      createClick(2, 2, false),
      createClick(3, 2, false),
      createClick(3, 3, false),
      createClick(4, 3, false),
      createClick(4, 3, false),
      createClick(4, 3, false),
      createClick(5, 3, false),
      createClick(6, 3, false),
      createClick(7, 3, false),
      createClick(8, 4, false),
      createClick(9, 4, false),
      createClick(10, 4, false),
      createClick(11, 4, false),
      createClick(11, 8, true),
      createClick(11, 8, true),
      createClick(10, 8, true),
      createClick(9, 8, true),
      createClick(8, 8, true)
    ]
  }, {
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
      createClick(3, 1, false),
      createClick(4, 1, false),
      createClick(5, 1, false),
      createClick(7, 5, false),
      createClick(10, 1, true),
      createClick(8, 1, true),
      createClick(8, 1, true),
      createClick(7, 3, true),
      createClick(8, 5, true),
      createClick(3, 2, false),
      createClick(4, 3, false),
      createClick(4, 4, false),
      createClick(5, 3, false),
      createClick(5, 4, false),
      createClick(6, 3, false),
      createClick(6, 4, false),
      createClick(7, 3, false),
      createClick(9, 5, false),
      createClick(10, 7, true),
      createClick(8, 5, false),
      createClick(8, 4, false),
      createClick(9, 5, false),
      createClick(9, 6, false),
      createClick(9, 4, false),
      createClick(10, 5, false),
      createClick(10, 6, false),
      createClick(10, 4, false),
      createClick(11, 5, false),
      createClick(11, 4, false)
    ]
  }
];

function createLevels(user, callback) {
  var author = user.id.toString();
  levels.forEach(function(level, index) {
    var clicks = level.solution.length;
    level.author = author;
    level.name = 'Level ' + (index + 1);
    level.layout = JSON.stringify(level.layout);
    level.solution = JSON.stringify(level.solution);
    level.clicks = clicks;
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
        level = new Level();
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
