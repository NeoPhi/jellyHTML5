var core = require('./core');

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
      context.fillRect((x + 1) * 40 - 10, y * 40 + 1, 20, 38);
    }
    if (lookup[x + ',' + (y + 1)]) {
      context.fillRect(x * 40 + 1, (y + 1) * 40 - 10, 38, 20);
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

function drawAttachment(object, context) {
  setFillStyle(object.color, context);
  object.coordinates.forEach(function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    object.attachments.forEach(function(attachment) {
      if (attachment.collides([{
        x: x + 1,
        y: y
      }])) {
        context.fillRect((x + 1) * 40 - 5, y * 40 + 15, 15, 10);
      }
      if (attachment.collides([{
        x: x - 1,
        y: y
      }])) {
        context.fillRect(x * 40 - 10, y * 40 + 15, 15, 10);
      }
      if (attachment.collides([{
        x: x,
        y: y + 1
      }])) {
        context.fillRect(x * 40 + 15, (y + 1) * 40 - 5, 10, 15);
      }
      if (attachment.collides([{
        x: x,
        y: y - 1
      }])) {
        context.fillRect(x * 40 + 15, y * 40 - 10, 10, 15);
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
    roundedRect(context, x * 40 + 1, y * 40 + 1, 38, 38, 10);
  });
  if (doConnect) {
    drawConnections(object, lookup, context);
  }
}

function drawGameBoard(gameBoard, context) {
  context.clearRect(0, 0, 560, 400);
  var walls = [];
  var wallLookup = {};
  gameBoard.getObjects().forEach(function(object) {
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
  gameBoard.getObjects().forEach(function(object) {
    if (!object.attachments || (object.attachments.length === 0)) {
      return;
    }
    if (object.color.charAt(0) === 'l') {
      return;
    }
    drawAttachment(object, context);
  });
}

function setStatus(document, text) {
  var status = document.getElementById('status');
  while (status.firstChild) {
    status.removeChild(status.firstChild);
  }
  status.appendChild(document.createTextNode(text));
}

function isComplete(document, gameBoard) {
  if (gameBoard.complete()) {
    setStatus(document, 'COMPLETE!');
  }
}

function slideObject(document, state, container, event, left) {
  var gameBoard = state.gameBoard;
  var context = state.context;
  event.preventDefault();

  var x = Math.floor((event.pageX - container.offsetLeft) / 40);
  var y = Math.floor((event.pageY - container.offsetTop) / 40);
  // console.log('      createClick(' + x + ', ' + y + ', ' + left + '),');

  if (gameBoard.click(x, y, left)) {
    drawGameBoard(gameBoard, context);
    isComplete(document, gameBoard);
  }
}

function construct(document, context, level) {
  var gameBoard = core.createGameBoard(level.layout);
  drawGameBoard(gameBoard, context);
  setStatus(document, '');
  return gameBoard;
}

function loadLevel(window, id, state) {
  window.$.ajax({
    url: '/levels/' + id,
    success: function(data) {
      window.location.hash = '#' + id;
      state.gameBoard = construct(window.document, state.context, data);
    }
  });
}

function loadLevels(window, state) {
  window.$.ajax({
    url: '/levels/',
    success: function(data) {
      window.$('#levels').html(function() {
        var levels = data.map(function(level) {
          return '<li><button class="btn" data-level="' + level.id + '">' + level.name + '</button></li>';
        });
        return levels.join('');
      }).on('click', function(event) {
        loadLevel(window, window.$(event.target).data('level'), state);
      });
      if (window.location.hash) {
        loadLevel(window, window.location.hash.substring(1), state);
      }
    }
  });
}

function doIt(window) {
  var document = window.document;
  var drawingCanvas = document.getElementById('board');
  if (drawingCanvas.getContext) {
    var context = drawingCanvas.getContext('2d');
    var state = {
      context: context
    };
    loadLevels(window, state);

    window.$('#board').on('click', function(event) {
      slideObject(document, state, this, event, true);
    }).on('contextmenu', function(event) {
      slideObject(document, state, this, event, false);
    });

    /*
    document.getElementById('reset').addEventListener('click', function() {
      gameBoard = construct(document, context);
    });
    */
  } else {
    setStatus(document, 'Unable to get drawing context');
  }
}

module.exports.doIt = doIt;
