var core = require('./core');

var levels = [
  [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                         x ',
    'x             r           x ',
    'x             x x         x ',
    'x     g           r   b   x ',
    'x x b x x x g   x x x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                         x ',
    'x                         x ',
    'x           g       g     x ',
    'x       r   r       r     x ',
    'x x x x x   x   x   x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                         x ',
    'x       b g     x   g     x ',
    'x x x   x x x r x x x     x ',
    'x             b           x ',
    'x x x   x x x r x x x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x               r         x ',
    'x               b         x ',
    'x               x         x ',
    'x   b   r                 x ',
    'x   b   r             b   x ',
    'x x x   x             x x x ',
    'x x x x x   x x x x x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                         x ',
    'x r g     g g             x ',
    'x x x   x x x x   x x     x ',
    'x r g                     x ',
    'x x x x x     x x       x x ',
    'x x x x x x   x x     x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x x x x x x x             x ',
    'x x x x x x x   g         x ',
    'x               x x       x ',
    'x   r       b             x ',
    'x   x   x x x   x   g     x ',
    'x                   x   b x ',
    'x               r   x x x x ',
    'x       x x x x x x x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                     r   x ',
    'x                     x   x ',
    'x           b       b     x ',
    'x           x     r r     x ',
    'x                   x     x ',
    'x   rb    bbx   x   x     x ',
    'x   x     x x   x   x     x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x x x x   x     x   x x x x ',
    'x x x     g     b     x x x ',
    'x x       x     x       x x ',
    'x x       bt    gt      x x ',
    'x x g                 b x x ',
    'x x x g             b x x x ',
    'x x x x             x x x x ',
    'x x x x x x x x x x x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x                         x ',
    'x                         x ',
    'x                         x ',
    'x                         x ',
    'x                     r b x ',
    'x         x           x x x ',
    'x b                 l l x x ',
    'x x     rbx     x   x x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x       g r               x ',
    'x       l0l0  l1          x ',
    'x         x   x   x x x x x ',
    'x                         x ',
    'x     x     x             x ',
    'x                 x     rbx ',
    'x x       x           gbx x ',
    'x                     x x x ',
    'x x x x x x x x x x x x x x '
  ], [
    'x x x x x x x x x x x x x x ',
    'x             yrl0l0yl  y x ',
    'x               x x x   x x ',
    'x                       y x ',
    'x l1l1                  x x ',
    'x x x                     x ',
    'x               y         x ',
    'x       x   x x x       ybx ',
    'x       x x x x x x   x x x ',
    'x x x x x x x x x x x x x x '
  ]
];

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
  var colors = {};
  var complete = true;
  gameBoard.getObjects().forEach(function(object) {
    if (!object.mergable()) {
      return;
    }
    if (object.color in colors) {
      complete = false;
    } else {
      colors[object.color] = 1;
    }
  });
  if (complete) {
    setStatus(document, 'COMPLETE!');
  }
}

function slideObject(document, gameBoard, event, left, context) {
  event.preventDefault();
  var x = Math.floor(event.offsetX / 40);
  var y = Math.floor(event.offsetY / 40);
  var coordinates = [{
    x: x,
    y: y
  }];
  // console.log('    createClick(' + x + ', ' + y + ', ' + left + '),');
  var objects = gameBoard.getObjects();
  for (var i = 0; i < objects.length; i += 1) {
    var object = objects[i];
    if (object.collides(coordinates)) {
      if (!object.movable()) {
        return;
      }
      var moved;
      if (left) {
        moved = gameBoard.slideLeft(object);
      } else {
        moved = gameBoard.slideRight(object);
      }
      if (moved) {
        drawGameBoard(gameBoard, context);
        isComplete(document, gameBoard);
      }
      return;
    }
  }
}

function constructRow(row, y, gameBoard, objects, attachments) {
  var parts = row.split(/(?:)/);
  for (var i = 0; i < parts.length; i += 2) {
    var letter = parts[i];
    var control = parts[i + 1];
    var x = Math.floor(i / 2);
    if (letter === ' ') {
      continue;
    }
    var object;
    if (letter === 'x') {
      object = core.createWall(x, y);
    } else if (letter === 'l') {
      object = core.createJelly(x, y, letter + control);
      control = ' ';
    } else {
      object = core.createJelly(x, y, letter);
    }
    gameBoard.addObject(object);
    objects[x + ',' + y] = object;
    if (control === ' ') {
      continue;
    }
    var dx = 0;
    var dy = 0;
    if (control === 't') {
      dy = -1;
    }
    if (control === 'r') {
      dx = 1;
    }
    if (control === 'b') {
      dy = 1;
    }
    if (control === 'l') {
      dx = -1;
    }
    attachments.push({
      src: x + ',' + y,
      dest: (x + dx) + ',' + (y + dy)
    });
  }
}

function construct(document, context) {
  var selector = document.getElementById('levels');
  var level = levels[selector.value || 0];
  // TODO Level parsing should be part of core
  var gameBoard = core.createGameBoard();
  var objects = {};
  var attachments = [];
  level.forEach(function(row, y) {
    constructRow(row, y, gameBoard, objects, attachments);
  });
  attachments.forEach(function(attachment) {
    var src = objects[attachment.src];
    var dest = objects[attachment.dest];
    // TODO this should be handled by attachment method
    src.attach(dest, dest.movable());
  });
  gameBoard.postSetup();
  drawGameBoard(gameBoard, context);
  setStatus(document, '');
  return gameBoard;
}

function doIt(document, window) {
  var drawingCanvas = document.getElementById('board');
  if (drawingCanvas.getContext) {
    var context = drawingCanvas.getContext('2d');
    var initialLevel = 0;
    if (window.location.hash) {
      initialLevel = parseInt(window.location.hash.substring(1), 10);
    }

    var selector = document.getElementById('levels');
    levels.forEach(function(level, i) {
      var option = document.createElement('option');
      if (i === initialLevel) {
        option.selected = true;
      }
      option.value = i;
      option.text = 'Level ' + (i + 1);
      selector.appendChild(option);
    });
    selector.addEventListener('change', function() {
      window.location.hash = '#' + selector.value;
      gameBoard = construct(document, context);
    });

    var gameBoard = construct(document, context);
    drawGameBoard(gameBoard, context);
    drawingCanvas.addEventListener('click', function(event) {
      slideObject(document, gameBoard, event, true, context);
    });
    drawingCanvas.addEventListener('contextmenu', function(event) {
      slideObject(document, gameBoard, event, false, context);
    });

    document.getElementById('reset').addEventListener('click', function() {
      gameBoard = construct(document, context);
    });
  } else {
    setStatus(document, 'Unable to get drawing context');
  }
}

module.exports.doIt = doIt;
