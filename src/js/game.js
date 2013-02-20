var core = require('./core');

var levels = [
  [
    'xxxxxxxxxxxxxx',
    'x            x',
    'x            x',
    'x      r     x',
    'x      xx    x',
    'x  g     r b x',
    'xxbxxxg xxxxxx',
    'xxxxxxxxxxxxxx'
  ], [
    'xxxxxxxxxxxxxx',
    'x            x',
    'x            x',
    'x            x',
    'x     g   g  x',
    'x   r r   r  x',
    'xxxxx x x xxxx',
    'xxxxxxxxxxxxxx'
  ], [
    'xxxxxxxxxxxxxx',
    'x            x',
    'x            x',
    'x   bg  x g  x',
    'xxx xxxrxxx  x',
    'x      b     x',
    'xxx xxxrxxxxxx',
    'xxxxxxxxxxxxxx'
  ], [
    'xxxxxxxxxxxxxx',
    'x            x',
    'x       r    x',
    'x       b    x',
    'x       x    x',
    'x b r        x',
    'x b r      b x',
    'xxx x      xxx',
    'xxxxx xxxxxxxx',
    'xxxxxxxxxxxxxx'
  ], [
    'xxxxxxxxxxxxxx',
    'x            x',
    'x            x',
    'xrg  gg      x',
    'xxx xxxx xx  x',
    'xrg          x',
    'xxxxx  xx   xx',
    'xxxxxx xx  xxx',
    'xxxxxxxxxxxxxx'
  ], [
    'xxxxxxxxxxxxxx',
    'xxxxxxx      x',
    'xxxxxxx g    x',
    'x       xx   x',
    'x r   b      x',
    'x x xxx x g  x',
    'x         x bx',
    'x       r xxxx',
    'x   xxxxxxxxxx',
    'xxxxxxxxxxxxxx'
  ]
];

// https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Drawing_shapes

function roundedRect(context, x, y, width, height, radius){
  context.beginPath();
  context.moveTo(x,y+radius);
  context.lineTo(x,y+height-radius);
  context.quadraticCurveTo(x,y+height,x+radius,y+height);
  context.lineTo(x+width-radius,y+height);
  context.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  context.lineTo(x+width,y+radius);
  context.quadraticCurveTo(x+width,y,x+width-radius,y);
  context.lineTo(x+radius,y);
  context.quadraticCurveTo(x,y,x,y+radius);
  context.fill();
}

function drawObject(object, context) {
  object.coordinates.forEach(function(coordinates) {
    roundedRect(context, coordinates.x * 40 + 1, coordinates.y * 40 + 1, 38, 38, 10);
  });
}

function drawGameBoard(gameBoard, context) {
  context.clearRect(0, 0, 560, 400);
  gameBoard.getObjects().forEach(function(object) {
    if (object.color) {
      if (object.color === 'r') {
        context.fillStyle = 'rgb(255,0,0)';
      } else if (object.color === 'g') {
        context.fillStyle = 'rgb(0,255,0)';
      } else {
        context.fillStyle = 'rgb(0,0,255)';
      }
    } else {
      context.fillStyle = 'rgb(128,128,128)';
    }
    drawObject(object, context);
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

function constructRow(row, y, gameBoard) {
  var parts = row.split(/(?:)/);
  parts.forEach(function(letter, x) {
    if (letter === ' ') {
      return;
    }
    if (letter === 'x') {
      return gameBoard.addObject(core.createWall(x, y));
    }
    gameBoard.addObject(core.createJelly(x, y, letter));
  });
}

function construct(document, context) {
  var selector = document.getElementById('levels');
  var level = levels[selector.value || 0];
  // TODO Level parsing should be part of core
  var gameBoard = core.createGameBoard();
  level.forEach(function(row, y) {
    constructRow(row, y, gameBoard);
  });
  gameBoard.postSetup();
  drawGameBoard(gameBoard, context);
  setStatus(document, '');
  return gameBoard;
}

function doIt(document) {
  var drawingCanvas = document.getElementById('board');
  if (drawingCanvas.getContext) {
    var context = drawingCanvas.getContext('2d');
    var gameBoard = construct(document, context);
    drawGameBoard(gameBoard, context);
    drawingCanvas.addEventListener('click', function(event) {
      slideObject(document, gameBoard, event, true, context);
    });
    drawingCanvas.addEventListener('contextmenu', function(event) {
      slideObject(document, gameBoard, event, false, context);
    });

    var selector = document.getElementById('levels');
    levels.forEach(function(level, i) {
      var option = document.createElement('option');
      option.value = i;
      option.text = 'Level ' + (i + 1);
      selector.appendChild(option);
    });
    selector.addEventListener('change', function() {
      gameBoard = construct(document, context);
    });
    document.getElementById('reset').addEventListener('click', function() {
      gameBoard = construct(document, context);
    });
  } else {
    setStatus(document, 'Unable to get drawing context');
  }
}

module.exports.doIt = doIt;
