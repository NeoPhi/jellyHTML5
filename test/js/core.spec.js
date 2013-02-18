describe('core', function() {
  var core = require('../../src/js/core');

  var jelly;
  var wall;
  var gameBoard;

  beforeEach(function() {
    jelly = core.createJelly(1, 1);
    wall = core.createWall(0, 1);
    gameBoard = core.createGameBoard();
  });

  it('can move a jelly on an empty board', function() {
    gameBoard.addObject(jelly);
    expect(gameBoard.move(jelly, -1, 0)).toBe(true);
    expect(jelly.collides([{
      x: 0,
      y: 1
    }])).toBe(true);
  });

  it('does not move a jelly next to a wall', function() {
    gameBoard.addObject(jelly);
    gameBoard.addObject(wall);
    expect(gameBoard.move(jelly, -1, 0)).toBe(false);
    expect(jelly.collides([{
      x: 0,
      y: 1
    }])).toBe(false);
  });

  it('can move a jelly next to another jelly', function() {
    gameBoard.addObject(jelly);
    var jelly2 = core.createJelly(0, 1);
    gameBoard.addObject(jelly2);
    expect(gameBoard.move(jelly, -1, 0)).toBe(true);
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
    expect(gameBoard.move(jelly2, -1, 0)).toBe(false);
  });

  it('accounts for vertical position', function() {
    gameBoard.addObject(jelly);
    var jelly2 = core.createJelly(2, 2);
    gameBoard.addObject(jelly2);
    gameBoard.addObject(wall);
    expect(gameBoard.move(jelly2, -1, 0)).toBe(true);
    expect(jelly.collides([{
      x: 1,
      y: 1
    }])).toBe(true);
    expect(jelly2.collides([{
      x: 1,
      y: 2
    }])).toBe(true);
  });

  it('accounts for height', function() {
    gameBoard.addObject(jelly);
    var jelly2 = core.createJelly(2, 2);
    jelly2.addCoordinates(2, 1);
    gameBoard.addObject(jelly2);
    gameBoard.addObject(wall);
    expect(gameBoard.move(jelly2, -1, 0)).toBe(false);
    expect(jelly.collides([{
      x: 1,
      y: 1
    }])).toBe(true);
    expect(jelly2.collides([{
      x: 1,
      y: 2
    }])).toBe(false);
    expect(jelly2.collides([{
      x: 1,
      y: 1
    }])).toBe(false);
  });
});
