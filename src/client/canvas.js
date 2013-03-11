var game = require('../shared/game');

var WIDTH = 40;
var HEIGHT = 40;
var MARGIN = 1;
var RADIUS = 10;

// https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Drawing_shapes

function roundedRect(context, x, y, width, height, radius){
  context.beginPath();
  context.moveTo(x, y + radius);
  context.lineTo(x, y + height - radius);
  context.quadraticCurveTo(x, y + height, x + radius, y + height);
  context.lineTo(x + width - radius, y + height);
  context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  context.lineTo(x + width, y + radius);
  context.quadraticCurveTo(x + width, y, x + width - radius, y);
  context.lineTo(x + radius,y);
  context.quadraticCurveTo(x, y, x, y + radius);
  context.fill();
}

function drawConnections(object, lookup, context) {
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    if (lookup[(x + 1) + ',' + y]) {
      context.fillRect(((x + MARGIN) * WIDTH) - RADIUS, (y * HEIGHT) + MARGIN, RADIUS * 2, HEIGHT - (MARGIN * 2));
    }
    if (lookup[x + ',' + (y + 1)]) {
      context.fillRect((x * WIDTH) + MARGIN, ((y + MARGIN) * HEIGHT) - RADIUS, WIDTH - (MARGIN * 2), RADIUS * 2);
    }
  });
}

function setFillStyle(color, context) {
  if (color === 'r') {
    context.fillStyle = 'rgb(255,0,0)';
  } else if (color === 'g') {
    context.fillStyle = 'rgb(0,255,0)';
  } else if (color === 'b') {
    context.fillStyle = 'rgb(0,0,255)';
  } else if (color === 'y') {
    context.fillStyle = 'rgb(256,208,32)';
  } else if (color.charAt(0) === 'l') {
    context.fillStyle = 'rgb(128,0,128)';
  } else {
    throw new Error('Unknown color: ' + color);
  }
}

function drawAttachment(state, object) {
  setFillStyle(object.color, state.context);
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    var spacing = RADIUS / 2;
    object.attachments.forEach(function(attachment) {
      if (attachment.collides([{
        x: x + 1,
        y: y
      }])) {
        state.context.fillRect((x + 1) * WIDTH - spacing, (y * HEIGHT) + (spacing * 3), spacing * 3, spacing * 2);
      }
      if (attachment.collides([{
        x: x - 1,
        y: y
      }])) {
        state.context.fillRect((x * WIDTH) - (spacing * 2), (y * HEIGHT) + (spacing * 3), spacing * 3, spacing * 2);
      }
      if (attachment.collides([{
        x: x,
        y: y + 1
      }])) {
        state.context.fillRect((x * WIDTH) + (spacing * 3), ((y + 1) * HEIGHT) - spacing, (spacing * 2), (spacing * 3));
      }
      if (attachment.collides([{
        x: x,
        y: y - 1
      }])) {
        state.context.fillRect((x * WIDTH) + (spacing * 3), (y * HEIGHT) - (spacing * 2), spacing * 2, spacing * 3);
      }
    });
  });
}

function drawObject(object, lookup, doConnect, context) {
  object.coordinates.forEach(function(coordinates) {
    lookup[coordinates.x + ',' + coordinates.y] = true;
  });
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    roundedRect(context, (x * WIDTH) + MARGIN, (y * HEIGHT) + MARGIN, WIDTH - (MARGIN * 2), HEIGHT - (MARGIN * 2), RADIUS);
    if (object.spawnColor) {
      setFillStyle(object.spawnColor, context);
      var spacing = RADIUS / 2;
      context.fillRect((x * WIDTH) + MARGIN, (y * HEIGHT) + MARGIN, WIDTH - (MARGIN * 2), spacing);
      if (object.spawnFixed) {
        context.fillRect((x * WIDTH) + (spacing * 3), (y * HEIGHT) + MARGIN, spacing * 2, spacing * 2);
      }
    }
  });
  if (doConnect) {
    drawConnections(object, lookup, context);
  }
}

function drawGameBoard(state) {
  var context = state.context;
  context.clearRect(0, 0, WIDTH * 14, HEIGHT * 10);
  var walls = [];
  var wallLookup = {};
  state.gameBoard.getObjects().forEach(function(object) {
    var lookup = {};
    var doConnect = true;
    if (object.color) {
      setFillStyle(object.color, context);
    } else {
      context.fillStyle = 'rgb(128,128,128)';
      lookup = wallLookup;
      doConnect = false;
      walls.push(object);
    }
    drawObject(object, lookup, doConnect, context);
  });
  walls.forEach(function(wall) {
    drawConnections(wall, wallLookup, context);
  });
  state.gameBoard.getObjects().forEach(function(object) {
    if (!object.attachments || (object.attachments.length === 0)) {
      return;
    }
    if (object.color.charAt(0) === 'l') {
      return;
    }
    drawAttachment(state, object);
  });
}

function updateStatus(state) {
  var reset = state.window.$('#reset');
  var moveCount = state.moves.length;
  if (moveCount === 0) {
    reset.addClass('disabled');
  } else {
    reset.removeClass('disabled');
  }
  state.window.$('#moveCount').text(moveCount);
}

function renderLevel(state, level) {
  var data = {
    level: level,
    bestMessage: '&#8734;',
    movesMessage: '&#8734;',
    buttonStatus: ''
  };
  if (level.status && (level.status.moves > 0)) {
    data.movesMessage = level.status.moves;
    if (level.status.moves > level.moves) {
      data.buttonStatus = 'btn-info';
    }
  } else {
    data.buttonStatus = 'btn-success';
  }
  if (level.moves > 0) {
    data.bestMessage = level.moves;
  }
  return state.templates.level(data);
}

function checkSolved(state) {
  if (state.gameBoard.solved()) {
    state.solved = true;
    // TODO add error handler
    state.window.$.ajax({
      url: '/levels/' + state.level.id + '/verify',
      data: JSON.stringify({
        solution: state.moves
      }),
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      success: function(level) {
        state.window.$('#levelSolved').modal('show');
        state.window.$('#level' + level.id).replaceWith(renderLevel(state, level));
        // Update local state with new data from server
        state.level = level;
      }
    });
  }
}

function slideObject(state, move) {
  if (!state.level || state.solved) {
    return;
  }
  if (state.gameBoard.move(move.x, move.y, move.left)) {
    state.moves.push(move);
    drawGameBoard(state);
    updateStatus(state);
    checkSolved(state);
  }
}

function resetLevel(state) {
  state.gameBoard = game.createGameBoard(state.level.layout);
  state.moves = [];
  state.solved = false;
  state.window.$('#title').text(state.level.name);
  drawGameBoard(state);
  updateStatus(state);
}

function loadLevel(state, id) {
  // TODO add error handler
  state.window.$.ajax({
    url: '/levels/' + id,
    success: function(level) {
      state.window.location.hash = '#' + id;
      state.level = level;
      resetLevel(state);
    }
  });
}

function loadLevels(state) {
  // TODO add error handler
  state.window.$.ajax({
    url: '/levels/',
    success: function(levels) {
      levels.sort(function(a, b) {
        return a.index - b.index;
      });
      state.window.$('#levels').html(function() {
        return levels.map(function(level) {
          return renderLevel(state, level);
        }).join('');
      }).on('click', function(event) {
        var id = state.window.$(event.target).data('level');
        if (id) {
          loadLevel(state, id);
        }
      });
      if (state.window.location.hash) {
        loadLevel(state, state.window.location.hash.substring(1));
      } else if (levels.length > 0) {
        loadLevel(state, levels[0].id);
      }
    }
  });
}

function translateClick(container, event, left) {
  event.preventDefault();
  var x = Math.floor((event.pageX - container.offsetLeft) / WIDTH);
  var y = Math.floor((event.pageY - container.offsetTop) / HEIGHT);
  return {
    x: x,
    y: y,
    left: left
  };
}

function translateSwipe(container, event, distance, left) {
  event.preventDefault();
  var delta = -distance;
  if (left) {
    delta *= -1;
  }
  var source = event.changedTouches[0];
  var x = Math.floor((source.pageX + delta - container.offsetLeft) / WIDTH);
  var y = Math.floor((source.pageY - container.offsetTop) / HEIGHT);
  return {
    x: x,
    y: y,
    left: left
  };
}

function render(window) {
  var state = {
    window: window,
    templates: {
      level: window._.template(window.$('#levelTemplate').html())
    }
  };
  var drawingCanvas = state.window.$('#board');
  if (drawingCanvas[0] && drawingCanvas[0].getContext) {
    state.context = drawingCanvas[0].getContext('2d');
    loadLevels(state);

    var ignoreClick = false;
    window.$('#board').on('mousedown', function() {
      ignoreClick = false;
    }).on('click', function(event) {
      if (!ignoreClick) {
        slideObject(state, translateClick(this, event, true));
      }
    }).on('contextmenu', function(event) {
      if (!ignoreClick) {
        slideObject(state, translateClick(this, event, false));
      }
    }).swipe({
      swipe: function(event, direction, distance) {
        // TODO Does event.preventDefault() work here?
        ignoreClick = true;
        if ((direction === 'left') || (direction === 'right')) {
          if (event.changedTouches && (event.changedTouches.length > 0)) {
            slideObject(state, translateSwipe(this[0], event, distance, (direction === 'left')));
          }
        }
      },
      threshold: WIDTH / 2
    });

    // TODO add undo/redo support
    window.$('#reset').on('click', function(event) {
      if (window.$(event.target).hasClass('disabled')) {
        return;
      }
      resetLevel(state);
    });
  } else {
    window.$('#canvasContext').removeClass('hide');
  }
}

module.exports.render = render;
