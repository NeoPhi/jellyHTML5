var core = require('./core');

var level = [
  'xxxxxxxxxxxxxx',
  'x            x',
  'x            x',
  'x      r     x',
  'x      xx    x',
  'x  g     r b x',
  'xxbxxxg xxxxxx',
  'xxxxxxxxxxxxxx'
];

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

function construct() {
  var gameBoard = core.createGameBoard();
  level.forEach(function(row, y) {
    constructRow(row, y, gameBoard);
  });
  return gameBoard;
}

function drawObject(object, context) {
  object.coordinates.forEach(function(coordinates) {
    context.fillRect(coordinates.x * 40, coordinates.y * 40, 40, 40);
  });
}

function doIt(document) {
  var gameBoard = construct();

  var drawingCanvas = document.getElementById('board');
  if (drawingCanvas.getContext) {
    var context = drawingCanvas.getContext('2d');
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
        context.fillStyle = 'rgb(0,0,0)';
      }
      drawObject(object, context);
    });
  }
}

module.exports.doIt = doIt;
