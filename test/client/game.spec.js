describe('client/game', function() {
  var game = require('../../src/client/game');
  var jQuery = require('../mock/jQuery');

  var window;
  var $;
  var _;
  var board;
  var context;
  var levels;
  var levelsList;
  var level;
  var reset;
  var levelComplete;
  var objects;
  var levelTemplate;

  function createMove(x, y, left) {
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

  function injectMove(move) {
    var event = {
      pageX: move.x * 40 + 20,
      pageY: move.y * 40 + 20,
      preventDefault: function() {}
    };
    var that = {
      offsetLeft: 0,
      offsetTop: 0
    };
    board.eventListeners[move.method].call(that, event);
  }

  function playLevel(moves) {
    spyOn(levelComplete, 'modal').andCallThrough();
    game.doIt(window);
    moves.forEach(injectMove);
    expect(levelComplete.modal.callCount).toBe(1);
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
    board[0] = {
      getContext: function() {
        return context;
      }
    };

    levels = new jQuery.Node();

    level = {
      id: '123',
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
    levelComplete = new jQuery.Node();

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
    $.addSelector('#level' + level.id, new jQuery.Node());
    $.addSelector('#reset', reset);
    $.addSelector('#levelComplete', levelComplete);
    $.addSelector('#levelTemplate', levelTemplate);
    $.addSelector('#moveCount', new jQuery.Node());

    $.ajax = function(options) {
      if (options.url === '/levels/') {
        return options.success(levelsList);
      }
      options.success(level);
    };

    window = {
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
    injectMove(createMove(2, 2, false));
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

  it('ignores move if no level is loaded', function() {
    delete window.location.hash;
    game.doIt(window);
    injectMove(createMove(2, 2, false));
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

  it('loads levels and handles move', function() {
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
    var moves = [
      createMove(2, 2, false),
      createMove(3, 2, false),
      createMove(8, 2, true),
      createMove(8, 3, true),
      createMove(3, 3, false),
      createMove(6, 3, true),
      createMove(7, 3, false),
      createMove(3, 3, true),
      createMove(5, 6, false),
      createMove(8, 3, true),
      createMove(7, 3, true),
      createMove(6, 5, true),
      createMove(2, 2, false),
      createMove(3, 2, false),
      createMove(3, 3, false),
      createMove(4, 3, false),
      createMove(4, 3, false),
      createMove(4, 3, false),
      createMove(5, 3, false),
      createMove(6, 3, false),
      createMove(7, 3, false),
      createMove(8, 4, false),
      createMove(9, 4, false),
      createMove(10, 4, false),
      createMove(11, 4, false),
      createMove(11, 8, true),
      createMove(11, 8, true),
      createMove(10, 8, true),
      createMove(9, 8, true),
      createMove(8, 8, true)
    ];
    playLevel(moves);
  });
});
