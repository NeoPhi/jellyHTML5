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

  describe('moveLeft', function() {
    beforeEach(function() {
      wall = core.createWall(0, 1);
    });

    it('can move a jelly on an empty board', function() {
      gameBoard.addObject(jelly);
      expect(gameBoard.moveLeft(jelly)).toBe(true);
      expect(jelly.collides([{
        x: 0,
        y: 1
      }])).toBe(true);
    });

    it('does not move a jelly next to a wall', function() {
      gameBoard.addObject(jelly);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly)).toBe(false);
      expect(jelly.collides([{
        x: 0,
        y: 1
      }])).toBe(false);
    });

    it('can move a jelly next to another jelly', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 1);
      gameBoard.addObject(jelly2);
      expect(gameBoard.moveLeft(jelly)).toBe(true);
      expect(jelly.collides([{
        x: 0,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
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
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
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
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
        x: 1,
        y: 0
      }])).toBe(false);
      expect(jelly2.collides([{
        x: 1,
        y: 1
      }])).toBe(false);
    });

    it('falls after moving', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(2, -1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveLeft(jelly2)).toBe(true);
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
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
      expect(jelly.collides([{
        x: 2,
        y: 1
      }])).toBe(true);
    });

    it('does not move a jelly next to a wall', function() {
      gameBoard.addObject(jelly);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly)).toBe(false);
      expect(jelly.collides([{
        x: 0,
        y: 1
      }])).toBe(false);
    });

    it('can move a jelly next to another jelly', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, 1);
      gameBoard.addObject(jelly2);
      expect(gameBoard.moveRight(jelly2)).toBe(true);
      expect(jelly.collides([{
        x: 2,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
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
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
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
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
        x: 1,
        y: 0
      }])).toBe(false);
      expect(jelly2.collides([{
        x: 1,
        y: 1
      }])).toBe(false);
    });

    it('falls after moving', function() {
      gameBoard.addObject(jelly);
      var jelly2 = core.createJelly(0, -1);
      gameBoard.addObject(jelly2);
      gameBoard.addObject(wall);
      expect(gameBoard.moveRight(jelly2)).toBe(true);
      expect(jelly.collides([{
        x: 1,
        y: 1
      }])).toBe(true);
      expect(jelly2.collides([{
        x: 1,
        y: 0
      }])).toBe(true);
    });
  });
});
