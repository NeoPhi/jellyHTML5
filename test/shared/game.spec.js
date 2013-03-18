describe('shared/game', function() {
  var game = require('../../src/shared/game');

  function byCoordinates(a, b) {
    if (a.x === b.x) {
      return a.y - b.y;
    }
    return a.x - b.x;
  }

  function createKey(object) {
    var key = object.type + ' ';
    object.coordinates.sort(byCoordinates);
    key += object.coordinates.map(function(coordinates) {
      return '(' + coordinates.x + ', ' + coordinates.y + ')';
    }).join(', ');
    return key;
  }

  function verifyObjects(expected, actual) {
    expect(actual.length).toBe(expected.length);
    var lookup = {};
    expected.forEach(function(object) {
      lookup[createKey(object)] = true;
    });
    var notFound = [];
    actual.forEach(function(object) {
      var key = createKey(object);
      if (lookup.hasOwnProperty(key)) {
        delete lookup[key];
      } else {
        notFound.push(key);
      }
    });
    var leftOver = [];
    for (var key in lookup) {
      if (lookup.hasOwnProperty(key)) {
        leftOver.push(key);
      }
    }
    expect(notFound).toEqual(leftOver);
  }

  function createCoordinates() {
    return [].slice.call(arguments).map(function(coordinates) {
      return {
        x: coordinates[0],
        y: coordinates[1]
      };
    });
  }

  function createWall() {
    return {
      type: game.WALL,
      coordinates: createCoordinates.apply(undefined, arguments)
    };
  }

  function createJelly() {
    return {
      type: game.JELLY,
      coordinates: createCoordinates.apply(undefined, arguments)
    };
  }

  it('ignores a move not on an object', function() {
    var gameBoard = game.createGameBoard([
      '- -',
      ' x ',
      '- -'
    ]);
    expect(gameBoard.move(10, 10, false)).toBe(false);
  });

  it('ignores a move on a wall', function() {
    var gameBoard = game.createGameBoard([
      '- -',
      ' x ',
      '- -'
    ]);
    expect(gameBoard.move(0, 0, false)).toBe(false);
  });

  it('can move a jelly', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      '    r ',
      '- -- -',
      '- -- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(1, 0, true)).toBe(true);
    verifyObjects([
      createJelly([0, 0]),
      createWall([0, 1]),
      createWall([1, 1])
    ], gameBoard.getObjects());
  });

  it('merges after move', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -',
      ' r     r ',
      '- -- -- -',
      '- -- -- -',
      ' x  x  x ',
      '- -- -- -'
    ]);
    expect(gameBoard.move(2, 0, true)).toBe(true);
    verifyObjects([
      createJelly([0, 0], [1, 0]),
      createWall([0, 1]),
      createWall([1, 1]),
      createWall([2, 1])
    ], gameBoard.getObjects());
  });

  it('merges two after move', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -',
      '       r ',
      '- -- -- -',
      '- -- -- -',
      '       x ',
      '- -- -- -',
      '- -- -- -',
      ' r     r ',
      '- -- -- -',
      '- -- -- -',
      ' x  x  x ',
      '- -- -- -'
    ]);
    expect(gameBoard.move(2, 0, true)).toBe(true);
    verifyObjects([
      createWall([2, 1]),
      createJelly([0, 2], [1, 2], [2, 2]),
      createWall([0, 3]),
      createWall([1, 3]),
      createWall([2, 3])
    ], gameBoard.getObjects());
  });

  it('does not move anchored jelly attached to jelly', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      ' b    ',
      '-a-- -',
      '- -- -',
      ' 0  x ',
      '- -- -',
      '- -- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(0, 0, false)).toBe(false);
    verifyObjects([
      createJelly([0, 0]),
      createJelly([0, 1]),
      createWall([1, 1]),
      createWall([0, 2]),
      createWall([1, 2])
    ], gameBoard.getObjects());
  });

  it('moves series of anchored jellies', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -',
      ' ra 0 ag ',
      '- -- -- -',
      '- -- -- -',
      '    x    ',
      '- -- -- -'
    ]);
    expect(gameBoard.move(0, 0, false)).toBe(true);
    verifyObjects([
      createJelly([1, 0]),
      createJelly([2, 0]),
      createJelly([3, 0]),
      createWall([1, 1])
    ], gameBoard.getObjects());
  });

  it('does not move series of anchored jellies', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      ' r  b ',
      '-a-- -',
      '- -- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(1, 0, true)).toBe(false);
    verifyObjects([
      createJelly([0, 0]),
      createJelly([1, 0]),
      createWall([0, 1]),
      createWall([1, 1])
    ], gameBoard.getObjects());
  });

  it('does not move a jelly next to a wall', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      ' x  b ',
      '- -- -',
      '- -- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(1, 0, true)).toBe(false);
    verifyObjects([
      createWall([0, 0]),
      createJelly([1, 0]),
      createWall([0, 1]),
      createWall([1, 1])
    ], gameBoard.getObjects());
  });

  it('can move a jelly next to another jelly', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -',
      '    r  b ',
      '- -- -- -',
      '- -- -- -',
      ' x  x  x ',
      '- -- -- -'
    ]);
    expect(gameBoard.move(2, 0, true)).toBe(true);
    verifyObjects([
      createJelly([0, 0]),
      createJelly([1, 0]),
      createWall([0, 1]),
      createWall([1, 1]),
      createWall([2, 1])
    ], gameBoard.getObjects());
  });

  it('spawns new jellies', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      '    r ',
      '- -- -',
      '-r-- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.solved()).toBe(false);
    expect(gameBoard.move(1, 0, true)).toBe(true);
    expect(gameBoard.solved()).toBe(true);
    verifyObjects([
      createJelly([0, 0], [0, -1]),
      createWall([0, 1]),
      createWall([1, 1])
    ], gameBoard.getObjects());
  });

  it('only spawns when it can', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      ' x    ',
      '- -- -',
      '- -- -',
      '    r ',
      '- -- -',
      '-r-- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(1, 1, true)).toBe(true);
    expect(gameBoard.solved()).toBe(false);
    verifyObjects([
      createWall([0, 0]),
      createJelly([0, 1]),
      createWall([0, 2]),
      createWall([1, 2])
    ], gameBoard.getObjects());
  });

  it('spawns fixed jelly', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -',
      '    r  g ',
      '- -- -- -',
      '-R-- -- -',
      ' x  x  x ',
      '- -- -- -'
    ]);
    expect(gameBoard.move(2, 0, true)).toBe(true);
    expect(gameBoard.move(0, 0, false)).toBe(false);
    verifyObjects([
      createJelly([0, 0], [0, -1]),
      createJelly([1, 0]),
      createWall([0, 1]),
      createWall([1, 1]),
      createWall([2, 1])
    ], gameBoard.getObjects());
  });

  it('spawns jelly on purple', function() {
    var gameBoard = game.createGameBoard([
      '- -- -',
      ' r    ',
      '- -- -',
      '- --r-',
      ' 0  0 ',
      '- -- -',
      '- -- -',
      ' x  x ',
      '- -- -'
    ]);
    expect(gameBoard.move(0, 0, false)).toBe(true);
    expect(gameBoard.solved()).toBe(true);
    verifyObjects([
      createJelly([1, 0], [1, -1]),
      createJelly([0, 1], [1, 1]),
      createWall([0, 2]),
      createWall([1, 2])
    ], gameBoard.getObjects());
  });

  it('moves spawner to spawn', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -- -',
      ' r          ',
      '- -- -- -- -',
      '- -- -- -- -',
      ' x    r0    ',
      '- -- -- -- -',
      '- -- -- -- -',
      ' x  x  x  x ',
      '- -- -- -- -'
    ]);
    expect(gameBoard.move(0, 0, false)).toBe(true);
    expect(gameBoard.solved()).toBe(true);
    verifyObjects([
      createJelly([1, 1], [2, 1]),
      createJelly([3, 1]),
      createWall([0, 1]),
      createWall([0, 2]),
      createWall([1, 2]),
      createWall([2, 2]),
      createWall([3, 2])
    ], gameBoard.getObjects());
  });

  it('creates complex level', function() {
    var gameBoard = game.createGameBoard([
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x  x  x  x  x  x  x  x  x  x  x  x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  ga 0              ga 2 ag  x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x     1 ag              2     x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  3  3  3              4     x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- --a-- --a-- -- -- -- --a-- -- -- -- -- -',
      ' x  g     g           g  g  g           x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x                 x  x  x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x                 x  x  x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x                 x  x  x        x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x                                x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -',
      ' x  x  x  x  x  x  x  x  x  x  x  x  x  x ',
      '- -- -- -- -- -- -- -- -- -- -- -- -- -- -'
    ]);
    expect(gameBoard.getObjects().length).toBe(76);
    expect(gameBoard.solved()).toBe(false);
  });
});
