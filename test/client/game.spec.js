describe('client/game', function() {
  var game = require('../../src/client/game');

  var document;
  var window;
  var $;
  var board;
  var context;
  var levels;
  var level;
  var reset;
  var status;
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

  function playLevel(clicks) {
    spyOn(status, 'appendChild').andCallThrough();
    game.doIt(window);

    clicks.forEach(function(click) {
      var event = {
        pageX: click.x * 40 + 20,
        pageY: click.y * 40 + 20,
        preventDefault: function() {}
      };
      var that = {
        offsetLeft: 0,
        offsetTop: 0
      };
      board.eventListeners[click.method].call(that, event);
    });
    expect(status.appendChild.callCount).toBe(2);
  }

  beforeEach(function() {
    objects = [];

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
      },
      on: function(name, fn) {
        board.eventListeners[name] = fn;
        return board;
      }
    };

    levels = {
      html: function() {
        return levels;
      },
      on: function() {
        return levels;
      }
    };

    level = {
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
      ]
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

    $ = function(name) {
      return {
        '#board': board,
        '#levels': levels
      }[name];
    };
    $.ajax = function(options) {
      if (options.url === '/levels/') {
        return options.success([]);
      }
      options.success(level);
    };

    window = {
      document: document,
      location: {
        hash: '12345'
      },
      $: $
    };
  });

  it('plays level', function() {
    var clicks = [
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
    ];
    playLevel(clicks);
  });
});
