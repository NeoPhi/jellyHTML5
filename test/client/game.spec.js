describe('client/game', function() {
  var game = require('../../src/client/game');
  var jQuery = require('../mock/jQuery');

  var document;
  var window;
  var $;
  var _;
  var board;
  var context;
  var levels;
  var levelsList;
  var level;
  var reset;
  var status;
  var objects;
  var clicksTemplate;
  var levelTemplate;

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

    board = new jQuery.Node();
    board.getContext = function() {
      return context;
    };

    levels = new jQuery.Node();

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

    reset = new jQuery.Node();

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

    clicksTemplate = new jQuery.Node();
    levelTemplate = new jQuery.Node();

    _ = {
      template: function(html) {
        return function() {
          return html;
        };
      }
    };

    $ = jQuery.create();
    $.addSelector('#board', board);
    $.addSelector('#levels', levels);
    $.addSelector('#reset', reset);
    $.addSelector('#clicksTemplate', clicksTemplate);
    $.addSelector('#levelTemplate', levelTemplate);

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
      $: $,
      _: _
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
    spyOn(reset, 'hasClass').andCallThrough();
    spyOn(reset, 'addClass').andCallThrough();
    spyOn(reset, 'removeClass').andCallThrough();
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
    reset.addClass('disabled');
    spyOn(reset, 'hasClass').andCallThrough();
    spyOn(reset, 'addClass').andCallThrough();
    spyOn(reset, 'removeClass').andCallThrough();
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

  it('ignores click if no level is loaded', function() {
    delete window.location.hash;
    game.doIt(window);
    injectClick(createClick(2, 2, false));
    // this would throw errors if the code didn't check for it
  });

  it('defaults to first loaded level', function() {
    delete window.location.hash;
    levelsList = [level];
    spyOn($, 'ajax').andCallThrough();
    game.doIt(window);
    expect($.ajax.callCount).toBe(2);
    expect($.ajax.argsForCall[1][0].url).toBe('/levels/' + level.id);
  });

  it('loads levels and handles click', function() {
    delete window.location.hash;
    levelsList = [level];
    spyOn(levels, 'html').andCallThrough();
    spyOn(levelTemplate, 'html').andReturn('LEVEL');
    game.doIt(window);
    expect(levels.html.callCount).toBe(1);
    var html = levels.html.argsForCall[0][0]();
    expect(html).not.toBe('');
    var target = {
      data: function() {
        return 'ID';
      }
    };
    $.addSelector('target', target);
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
