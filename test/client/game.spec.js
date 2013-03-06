describe('client/game', function() {
  var game = require('../../src/client/game');

  var document;
  var window;
  var $;
  var $lookup;
  var board;
  var context;
  var levels;
  var levelsList;
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

  function injectClick(click) {
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
  }

  function playLevel(clicks) {
    spyOn(status, 'appendChild').andCallThrough();
    game.doIt(window);
    clicks.forEach(injectClick);
    expect(status.appendChild.callCount).toBe(3);
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
      eventListeners: {},
      html: function() {
        return levels;
      },
      on: function(name, fn) {
        levels.eventListeners[name] = fn;
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

    levelsList = [];

    reset = {
      eventListeners: {},
      addEventListener: function() {},
      addClass: jasmine.createSpy(),
      hasClass: jasmine.createSpy(),
      removeClass: jasmine.createSpy(),
      on: function(name, fn) {
        reset.eventListeners[name] = fn;
        return reset;
      }
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

    $lookup = {
      '#board': board,
      '#levels': levels,
      '#reset': reset
    };
    $ = function(name) {
      return $lookup[name];
    };
    $.ajax = function(options) {
      if (options.url === '/levels/') {
        return options.success(levelsList);
      }
      if (options.url.indexOf('/verify') !== -1) {
        return options.success({
          valid: true
        });
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

  it('creates game board', function() {
    spyOn(levels, 'html').andCallThrough();
    game.doIt(window);
    expect(levels.html.callCount).toBe(1);
    var html = levels.html.argsForCall[0][0]();
    expect(html).toBe('');
  });

  it('resets level', function() {
    game.doIt(window);
    expect(reset.hasClass.callCount).toBe(0);
    expect(reset.addClass.callCount).toBe(1);
    expect(reset.addClass.argsForCall[0][0]).toBe('disabled');
    expect(reset.removeClass.callCount).toBe(0);
    injectClick(createClick(2, 2, false));
    expect(reset.hasClass.callCount).toBe(0);
    expect(reset.addClass.callCount).toBe(1);
    expect(reset.removeClass.callCount).toBe(1);
    expect(reset.removeClass.argsForCall[0][0]).toBe('disabled');
    reset.eventListeners.click.call(reset, {
      target: '#reset'
    });
    expect(reset.hasClass.callCount).toBe(1);
    expect(reset.hasClass.argsForCall[0][0]).toBe('disabled');
    expect(reset.addClass.callCount).toBe(2);
    expect(reset.addClass.argsForCall[1][0]).toBe('disabled');
    expect(reset.removeClass.callCount).toBe(1);
  });

  it('ignores reset', function() {
    reset.hasClass.andReturn(true);
    game.doIt(window);
    expect(reset.hasClass.callCount).toBe(0);
    expect(reset.addClass.callCount).toBe(1);
    expect(reset.addClass.argsForCall[0][0]).toBe('disabled');
    expect(reset.removeClass.callCount).toBe(0);
    reset.eventListeners.click.call(reset, {
      target: '#reset'
    });
    expect(reset.hasClass.callCount).toBe(1);
    expect(reset.hasClass.argsForCall[0][0]).toBe('disabled');
    expect(reset.addClass.callCount).toBe(1);
    expect(reset.removeClass.callCount).toBe(0);
  });

  it('loads levels and handles click', function() {
    delete window.location.hash;
    levelsList = [level];
    spyOn(levels, 'html').andCallThrough();
    game.doIt(window);
    expect(levels.html.callCount).toBe(1);
    var html = levels.html.argsForCall[0][0]();
    expect(html).not.toBe('');
    var target = {
      data: function() {
        return 'ID';
      }
    };
    $lookup.target = target;
    spyOn($, 'ajax').andCallThrough();
    levels.eventListeners.click({
      target: 'target'
    });
    expect($.ajax.callCount).toBe(1);
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
