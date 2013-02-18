describe('core', function() {
  var core = require('../../src/js/core');

  var jelly;
  var wall;
  var gameBoard;

  beforeEach(function() {
    jelly = core.createJelly(1, 1);
    gameBoard = core.createGameBoard();
    for (var i = -1; i <= 3; i += 1) {
      gameBoard.addObject(core.createWall(i, 2));
    }
  });

  describe('movable', function() {
    beforeEach(function() {
      wall = core.createWall(0, 1);
    });

    it('wall is not', function() {
      expect(wall.movable()).toBe(false);
    });

    it('jelly is', function() {
      expect(jelly.movable()).toBe(true);
    });

    it('jelly anchored to wall is not', function() {
      jelly.addAnchor(wall);
      expect(jelly.movable()).toBe(false);
    });

    it('jelly anchored to jelly is', function() {
      jelly.addAnchor(core.createJelly(1, 2));
      expect(jelly.movable()).toBe(true);
    });
  });

  describe('moveLeft', function() {
    beforeEach(function() {
      wall = core.createWall(0, 1);
    });

    it('can move a jelly on an empty board', function() {
      gameBoard.addObject(jelly);
      expect(gameBoard.moveLeft(jelly)).toBe(true);
      expect(jelly.matches([{
        x: 0,
        y: 1
      }])).toBe(true);
    });

    it('does not move a jelly next to a wall', function() {
      gameBoard.addObject(jelly);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly)).toBe(false);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
    });

    it('can move a jelly next to another jelly', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 1);
      gameBoard.addObject(jelly2);
      expect(gameBoard.moveLeft(jelly)).toBe(true);
      expect(jelly.matches([{
        x: 0,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: -1,
        y: 1
      }])).toBe(true);
    });

    it('follows the chain', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(2, 1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly2)).toBe(false);
    });

    it('accounts for vertical position', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(2, 0);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly2)).toBe(true);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 1,
        y: 0
      }])).toBe(true);
    });

    it('accounts for height', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(2, 0);
      jelly2.addCoordinates(2, 1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly2)).toBe(false);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 2,
        y: 0
      }, {
        x: 2,
        y: 1
      }])).toBe(true);
    });

    it('falls after moving', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(2, -1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly2)).toBe(true);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 1,
        y: 0
      }])).toBe(true);
    });
  });

  describe('moveRight', function() {
    beforeEach(function() {
      wall = core.createWall(2, 1);
    });

    it('can move a jelly on an empty board', function() {
      gameBoard.addObject(jelly);
      expect(gameBoard.moveRight(jelly)).toBe(true);
      expect(jelly.matches([{
        x: 2,
        y: 1
      }])).toBe(true);
    });

    it('does not move a jelly next to a wall', function() {
      gameBoard.addObject(jelly);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly)).toBe(false);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
    });

    it('can move a jelly next to another jelly', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 1);
      gameBoard.addObject(jelly2);
      expect(gameBoard.moveRight(jelly2)).toBe(true);
      expect(jelly.matches([{
        x: 2,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
    });

    it('follows the chain', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly2)).toBe(false);
    });

    it('accounts for vertical position', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 0);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly2)).toBe(true);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 1,
        y: 0
      }])).toBe(true);
    });

    it('accounts for height', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 0);
      jelly2.addCoordinates(0, 1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly2)).toBe(false);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 1
      }])).toBe(true);
    });

    it('falls after moving', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, -1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly2)).toBe(true);
      expect(jelly.matches([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.matches([{
        x: 1,
        y: 0
      }])).toBe(true);
    });
  });
});
