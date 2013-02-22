describe('game.js', function() {
  var game = require('../../src/js/game');
  var core = require('../../src/js/core');

  var document;
  var window;
  var board;
  var context;
  var levels;
  var reset;
  var status;
  var gameBoard;
  var objects;

  function createClick(x, y, left) {
    var method = 'click';
    if (!left) {
      method = 'contextmenu';
    }
    return {
      x: x,
      y: y,
      method: method
    };
  }

  function playLevel(level, clicks) {
    spyOn(status, 'appendChild').andCallThrough();
    levels.value = level;

    game.doIt(document, window);

    clicks.forEach(function(click) {
      var event = {
        offsetX: click.x * 40 + 20,
        offsetY: click.y * 40 + 20,
        preventDefault: function() {}
      };
      board.eventListeners[click.method](event);
    });
    expect(status.appendChild.callCount).toBe(2, 'Level ' + (level + 1));
    if (status.appendChild.callCount === 2) {
      expect(status.appendChild.argsForCall[1][0].text).toBe('COMPLETE!');
    }
  }

  beforeEach(function() {
    objects = [];

    var orignalFn = core.createGameBoard;
    spyOn(core, 'createGameBoard').andCallFake(function() {
      gameBoard = orignalFn();
      spyOn(gameBoard, 'addObject').andCallThrough();
      return gameBoard;
    });

    context = {
      clearRect: function() {},
      fillStyle: function() {},
      beginPath: function() {},
      moveTo: function() {},
      lineTo: function() {},
      quadraticCurveTo: function() {},
      fill: function() {},
      fillRect: function() {}
    };

    board = {
      eventListeners: {},
      getContext: function() {
        return context;
      },
      addEventListener: function(name, fn) {
        board.eventListeners[name] = fn;
      }
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

    window = {
      location: {}
    };
  });

  it('creates initial level', function() {
    game.doIt(document, window);
    expect(gameBoard.addObject.callCount).toBe(57);
  });

  it('creates complex level', function() {
    levels.value = 6;
    game.doIt(document, window);
    expect(gameBoard.addObject.callCount).toBe(62);
  });

  it('plays level 1', function() {
    var clicks = [
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
    ];
    playLevel(0, clicks);
  });

  it('plays level 2', function() {
    var clicks = [
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
    ];
    playLevel(1, clicks);
  });

  it('plays level 3', function() {
    var clicks = [
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
    ];
    playLevel(2, clicks);
  });

  it('plays level 4', function() {
    var clicks = [
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
    ];
    playLevel(3, clicks);
  });

  it('plays level 5', function() {
    var clicks = [
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
    ];
    playLevel(4, clicks);
  });

  it('plays level 6', function() {
    var clicks = [
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
    ];
    playLevel(5, clicks);
  });

  it('plays level 7', function() {
    var clicks = [
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
    ];
    playLevel(6, clicks);
  });

  it('plays level 8', function() {
    var clicks = [
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
    ];
    playLevel(7, clicks);
  });

  it('plays level 9', function() {
    var clicks = [
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
    ];
    playLevel(8, clicks);
  });

  it('plays level 10', function() {
    var clicks = [
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
    ];
    playLevel(9, clicks);
  });

  it('plays level 11', function() {
    var clicks = [
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
    ];
    playLevel(10, clicks);
  });

  it('plays level 12', function() {
    var clicks = [
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
    ];
    playLevel(11, clicks);
  });

  it('plays level 13', function() {
    var clicks = [
      createClick(7, 3, false),
      createClick(6, 6, true),
      createClick(7, 5, false),
      createClick(7, 4, true),
      createClick(6, 4, true)
    ];
    playLevel(12, clicks);
  });

  it('plays level 14', function() {
    var clicks = [
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
    ];
    playLevel(13, clicks);
  });
});
