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
