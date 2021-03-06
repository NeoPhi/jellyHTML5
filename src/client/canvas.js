var game = require('../shared/game');

var WIDTH = 40;
var HEIGHT = 40;
var MARGIN = 1;
var RADIUS = 10;
var SPACING = RADIUS / 2;

// https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Drawing_shapes

function roundedRect(context, x, y, width, height, radius) {
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

var COLORS = {
  r: 'rgb(255,0,0)',
  g: 'rgb(0,255,0)',
  b: 'rgb(0,0,255)',
  y: 'rgb(256,208,32)',
  l: 'rgb(128,0,128)',
  x: 'rgb(128,128,128)'
};

function setFillStyle(color, context) {
  context.fillStyle = COLORS[color];
}

function drawAttachment(state, object) {
  setFillStyle(object.color, state.context);
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    object.attachments.forEach(function(attachment) {
      if (attachment.collides([{
        x: x + 1,
        y: y
      }])) {
        state.context.fillRect((x + 1) * WIDTH - SPACING, (y * HEIGHT) + (SPACING * 3), SPACING * 3, SPACING * 2);
      }
      if (attachment.collides([{
        x: x - 1,
        y: y
      }])) {
        state.context.fillRect((x * WIDTH) - (SPACING * 2), (y * HEIGHT) + (SPACING * 3), SPACING * 3, SPACING * 2);
      }
      if (attachment.collides([{
        x: x,
        y: y + 1
      }])) {
        state.context.fillRect((x * WIDTH) + (SPACING * 3), ((y + 1) * HEIGHT) - SPACING, (SPACING * 2), (SPACING * 3));
      }
      if (attachment.collides([{
        x: x,
        y: y - 1
      }])) {
        state.context.fillRect((x * WIDTH) + (SPACING * 3), (y * HEIGHT) - (SPACING * 2), SPACING * 2, SPACING * 3);
      }
    });
  });
}

var SPAWNERS = {
  top: function(x, y, fixed, context) {
    context.fillRect((x * WIDTH) + MARGIN, (y * HEIGHT) + MARGIN, WIDTH - (MARGIN * 2), SPACING);
    if (fixed) {
      context.fillRect((x * WIDTH) + (SPACING * 3), (y * HEIGHT) + MARGIN, SPACING * 2, SPACING * 2);
    }
  },
  left: function(x, y, fixed, context) {
    context.fillRect((x * WIDTH) + MARGIN, (y * HEIGHT) + MARGIN, SPACING, HEIGHT - (MARGIN * 2));
    if (fixed) {
      context.fillRect((x * WIDTH) + MARGIN, (y * HEIGHT) + (SPACING * 2), SPACING * 2, SPACING * 2);
    }
  },
  right: function(x, y, fixed, context) {
    context.fillRect(((x + 1) * WIDTH) - MARGIN - SPACING, (y * HEIGHT) + MARGIN, SPACING, HEIGHT - (MARGIN * 2));
    if (fixed) {
      context.fillRect(((x + 1) * WIDTH) - MARGIN - (SPACING * 2), (y * HEIGHT) + (SPACING * 2), SPACING * 2, SPACING * 2);
    }
  }
};


function drawObject(object, lookup, doConnect, context) {
  setFillStyle(object.color, context);
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    lookup[x + ',' + y] = true;
    roundedRect(context, (x * WIDTH) + MARGIN, (y * HEIGHT) + MARGIN, WIDTH - (MARGIN * 2), HEIGHT - (MARGIN * 2), RADIUS);
    coordinates.spawners.forEach(function(spawner) {
      if (spawner.activated) {
        return;
      }
      setFillStyle(spawner.color, context);
      SPAWNERS[spawner.direction](x, y, spawner.fixed, context);
      setFillStyle(object.color, context);
    });
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
    if (object.type === game.WALL) {
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
    if (object.color === 'l') {
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

function extractCoordinates(event) {
  return {
    x: event.pageX || event.clientX,
    y: event.pageY || event.clientY
  };
}

function createMove(container, coordinates, left) {
  var x = Math.floor((coordinates.x - container.offsetLeft) / WIDTH);
  var y = Math.floor((coordinates.y - container.offsetTop) / HEIGHT);
  return {
    x: x,
    y: y,
    left: left
  };
}

function translateClick(container, event, left) {
  event.preventDefault();
  var coordinates = extractCoordinates(event);
  return createMove(container, coordinates, left);
}

function translateSwipeCoordinates(container, swipeCoordinates) {
  var left = (swipeCoordinates.start.x > swipeCoordinates.end.x);
  return createMove(container, swipeCoordinates.start, left);
}

function createSwipeCoordinates(event) {
  return {
    start: extractCoordinates(event)
  };
}

function updateSwipeCoordinates(event, swipeCoordinates) {
  swipeCoordinates.end = extractCoordinates(event);
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

    var swipeCoordinates;
    window.$('#board').on('contextmenu', function(event) {
      event.preventDefault();
    }).swipe({
      // TODO move unit test
      swipeStatus: function(event, phase) {
        if (phase === 'start') {
          swipeCoordinates = createSwipeCoordinates(event);
        } else if (phase === 'move') {
          updateSwipeCoordinates(event, swipeCoordinates);
        } else if (phase === 'end') {
          slideObject(state, translateSwipeCoordinates(this[0], swipeCoordinates));
        } else if (phase === 'cancel') {
          var right = ((event.button === 2) || ((event.button === 0) && event.ctrlKey));
          slideObject(state, translateClick(this[0], event, !right));
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
