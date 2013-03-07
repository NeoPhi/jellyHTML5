var core = require('./core');

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
        state.context.fillRect((x + MARGIN) * WIDTH - spacing, (y * HEIGHT) + (spacing * 3), spacing * 3, spacing * 2);
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
        state.context.fillRect((x * WIDTH) + (spacing * 3), ((y + MARGIN) * HEIGHT) - spacing, (spacing * 2), (spacing * 3));
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

function updateButtons(state) {
  var reset = state.window.$('#reset');
  if (state.moves.length === 0) {
    reset.addClass('disabled');
  } else {
    reset.removeClass('disabled');
  }
}

function setStatus(state, text) {
  var status = state.document.getElementById('status');
  while (status.firstChild) {
    status.removeChild(status.firstChild);
  }
  status.appendChild(state.document.createTextNode(text));
}

function checkComplete(state) {
  if (state.gameBoard.complete()) {
    state.complete = true;
    setStatus(state, 'COMPLETE!');
    state.window.$.ajax({
      url: '/levels/' + state.level.id + '/verify',
      data: JSON.stringify({
        solution: state.moves
      }),
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      success: function(result) {
        // TODO Update client side HTML to reflect change
        if (result.valid) {
          setStatus(state, 'VERIFIED!');
        } else {
          setStatus(state, 'NOT VERIFIED!');
        }
      }
    });
  }
}

function slideObject(state, container, event, left) {
  event.preventDefault();
  if (!state.level || state.complete) {
    return;
  }
  var x = Math.floor((event.pageX - container.offsetLeft) / WIDTH);
  var y = Math.floor((event.pageY - container.offsetTop) / HEIGHT);
  state.moves.push({
    x: x,
    y: y,
    left: left
  });
  if (state.gameBoard.click(x, y, left)) {
    drawGameBoard(state);
    updateButtons(state);
    checkComplete(state);
  }
}

function resetLevel(state) {
  state.gameBoard = core.createGameBoard(state.level.layout);
  state.moves = [];
  state.complete = false;
  drawGameBoard(state);
  updateButtons(state);
  setStatus(state, '');
}

function loadLevel(state, id) {
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
  var clicksTemplate = state.window._.template(state.window.$('#clicksTemplate').html());
  var levelTemplate = state.window._.template(state.window.$('#levelTemplate').html());
  state.window.$.ajax({
    url: '/levels/',
    success: function(levels) {
      state.window.$('#levels').html(function() {
        // TODO Use client side templating engine
        // possibly something with bindings as this can change
        return levels.map(function(level) {
          var data = {
            level: level
          };
          if (level.status && (level.status.clicks > 0)) {
            data.clicksMessage = clicksTemplate(data);
            data.buttonStatus = '';
          } else {
            data.clicksMessage = '';
            data.buttonStatus = 'btn-success';
          }
          return levelTemplate(data);
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

function doIt(window) {
  var state = {
    window: window,
    document: window.document
  };
  var drawingCanvas = state.document.getElementById('board');
  if (drawingCanvas.getContext) {
    state.context = drawingCanvas.getContext('2d');
    loadLevels(state);

    window.$('#board').on('click', function(event) {
      slideObject(state, this, event, true);
    }).on('contextmenu', function(event) {
      slideObject(state, this, event, false);
    });

    window.$('#reset').on('click', function(event) {
      if (window.$(event.target).hasClass('disabled')) {
        return;
      }
      resetLevel(state);
    });
  } else {
    setStatus(state, 'Unable to get drawing context');
  }
}

module.exports.doIt = doIt;
