describe('client/core', function() {
  var core = require('../../src/client/core');

  var jelly;
  var wall;
  var gameBoard;

  function matches(expected, actual) {
    if (expected.length !== actual.length) {
      return false;
    }
    var lookup = {};
    actual.forEach(function(coordinates) {
      lookup[coordinates.x + ':' + coordinates.y] = true;
    });
    var hits = 0;
    expected.forEach(function(coordinates) {
      if (lookup[coordinates.x + ':' + coordinates.y]) {
        hits += 1;
      }
    });
    expect(actual.length).toBe(hits);
  }

  beforeEach(function() {
    jelly = core.createJelly(1, 1, 'r');
    gameBoard = core.createGameBoard();
    for (var i = -1; i <= 3; i += 1) {
      gameBoard.addObject(core.createWall(i, 2));
    }
    gameBoard.addObject(jelly);
  });

  describe('construct', function() {
    it('creates level', function() {
      gameBoard = core.createGameBoard([
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
      ]);
      expect(gameBoard.getObjects().length).toBe(76);
    });
  });

  describe('move', function() {
    beforeEach(function() {
      wall = core.createWall(0, 1);
    });

    it('ignores a move not on an object', function() {
      expect(gameBoard.move(10, 10, false)).toBe(false);
    });

    it('ignores a move on a wall', function() {
      expect(gameBoard.move(0, 2, false)).toBe(false);
    });

    it('can move a jelly on an empty board', function() {
      expect(gameBoard.move(1, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
    });

    it('merges after move', function() {
      var jelly2 = core.createJelly(3, 1, 'r');
      gameBoard.addObject(jelly2);

      var originalCount = gameBoard.getObjects().length;
      expect(gameBoard.move(3, 1, true)).toBe(true);
      matches([{
        x: 1,
        y: 1
      }, {
        x: 2,
        y: 1
      }], jelly.coordinates);
      expect(gameBoard.getObjects().length).toBe(originalCount - 1);
    });

    it('merges two after move', function() {
      var jelly2 = core.createJelly(3, 1, 'r');
      gameBoard.addObject(jelly2);

      var jelly3 = core.createJelly(3, -1, 'r');
      gameBoard.addObject(jelly3);

      var originalCount = gameBoard.getObjects().length;
      expect(gameBoard.move(3, -1, true)).toBe(true);
      matches([{
        x: 1,
        y: 1
      }, {
        x: 2,
        y: 1
      }, {
        x: 3,
        y: 1
      }], jelly.coordinates);
      expect(gameBoard.getObjects().length).toBe(originalCount - 2);
    });

    it('does not move anchored jelly attached to jelly', function() {
      var jelly2 = core.createJelly(1, 0, 'b');
      gameBoard.addObject(jelly2);
      jelly2.attach(jelly, true);
      gameBoard.addObject(wall);
      expect(gameBoard.move(1, 0, true)).toBe(false);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 0
      }], jelly2.coordinates);
    });

    it('supports funky jellies', function() {
      jelly.addCoordinates(3, 1);
      var jelly2 = core.createJelly(2, 1, 'b');
      gameBoard.addObject(jelly2);
      expect(gameBoard.move(2, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }, {
        x: 2,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 1
      }], jelly2.coordinates);
    });

    it('moves series of anchored jellies', function() {
      var jelly2 = core.createJelly(2, 1, 'b');
      jelly2.addCoordinates(3, 1);
      gameBoard.addObject(jelly2);
      jelly.attach(jelly2, true);

      var jelly3 = core.createJelly(4, 1, 'g');
      gameBoard.addObject(jelly3);
      jelly3.attach(jelly2, true);

      expect(gameBoard.move(2, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 1
      }, {
        x: 2,
        y: 1
      }], jelly2.coordinates);
      matches([{
        x: 3,
        y: 1
      }], jelly3.coordinates);
    });

    it('does not move series of anchored jellies', function() {
      var wall2  = core.createWall(1, 0);
      gameBoard.addObject(wall2);
      jelly.attach(wall2);

      var jelly2 = core.createJelly(2, 1, 'b');
      gameBoard.addObject(jelly2);

      expect(gameBoard.move(2, 1, true)).toBe(false);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 2,
        y: 1
      }], jelly2.coordinates);
    });

    it('moves anchored jelly attached to jelly', function() {
      var jelly2 = core.createJelly(1, 0, 'b');
      gameBoard.addObject(jelly2);
      jelly2.attach(jelly, true);
      expect(gameBoard.move(1, 0, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 0,
        y: 0
      }], jelly2.coordinates);
    });

    it('moves jelly anchored to jelly', function() {
      var jelly2 = core.createJelly(1, 0, 'b');
      gameBoard.addObject(jelly2);
      jelly2.attach(jelly, true);
      
      expect(gameBoard.move(1, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 0,
        y: 0
      }], jelly2.coordinates);
    });

    it('does not move a jelly next to a wall', function() {
      gameBoard.addObject(wall);
      expect(gameBoard.move(1, 1, true)).toBe(false);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
    });

    it('can move a jelly next to another jelly', function() {
      var jelly2 = core.createJelly(0, 1, 'b');
      gameBoard.addObject(jelly2);
      expect(gameBoard.move(1, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: -1,
        y: 1
      }], jelly2.coordinates);
    });

    it('follows the chain', function() {
      var jelly2 = core.createJelly(2, 1, 'b');
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.move(2, 1, true)).toBe(false);
    });

    it('accounts for vertical position', function() {
      var jelly2 = core.createJelly(2, 0, 'b');
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.move(2, 0, true)).toBe(true);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 0
      }], jelly2.coordinates);
    });

    it('applies gravity after move', function() {
      var jelly2 = core.createJelly(1, 0, 'b');
      gameBoard.addObject(jelly2);
      expect(gameBoard.move(1, 1, true)).toBe(true);
      matches([{
        x: 0,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 1
      }], jelly2.coordinates);
    });

    it('accounts for height', function() {
      var jelly2 = core.createJelly(2, 0, 'b');
      jelly2.addCoordinates(2, 1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.move(2, 0, true)).toBe(false);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 2,
        y: 0
      }, {
        x: 2,
        y: 1
      }], jelly2.coordinates);
    });

    it('falls after moving', function() {
      var jelly2 = core.createJelly(2, -1, 'b');
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.move(2, -1, true)).toBe(true);
      matches([{
        x: 1,
        y: 1
      }], jelly.coordinates);
      matches([{
        x: 1,
        y: 0
      }], jelly2.coordinates);
    });
  });
});
