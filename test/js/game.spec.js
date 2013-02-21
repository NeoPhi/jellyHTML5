describe('game.js', function() {
  var game = require('../../src/js/game');
  var core = require('../../src/js/core');

  var document;
  var board;
  var context;
  var levels;
  var reset;
  var status;
  var gameBoard;
  var objects;

  beforeEach(function() {
    objects = [];

    gameBoard = {
      getObjects: function() {
        return objects;
      },
      addObject: function(object) {
        objects.push(object);
      },
      postSetup: function() {}
    };
    spyOn(core, 'createGameBoard').andReturn(gameBoard);

    context = {
      clearRect: function() {},
      fillStyle: function() {},
      beginPath: function() {},
      moveTo: function() {},
      lineTo: function() {},
      quadraticCurveTo: function() {},
      fill: function() {}
    };

    board = {
      getContext: function() {
        return context;
      },
      addEventListener: function() {}
    };

    levels = {
      appendChild: function() {},
      addEventListener: function() {}
    };

    reset = {
      addEventListener: function() {}
    };

    status = {
      appendChild: function() {}
    };

    document = {
      getElementById: function(id) {
        return {
          board: board,
          levels: levels,
          reset: reset,
          status: status
        }[id];
      },
      createTextNode: function(text) {
        return {
          text: text
        };
      },
      createElement: function(type) {
        return {
          type: type
        };
      }
    };
  });

  it('creates initial level', function() {
    spyOn(gameBoard, 'addObject').andCallThrough();
    game.doIt(document);
    expect(gameBoard.addObject.callCount).toBe(57);
  });

  it('creates complex level', function() {
    levels.value = 6;
    spyOn(gameBoard, 'addObject').andCallThrough();
    game.doIt(document);
    expect(gameBoard.addObject.callCount).toBe(62);
  });
});
