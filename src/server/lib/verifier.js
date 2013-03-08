var core = require('../../client/core');

function check(layout, solution, callback) {
  var gameBoard = core.createGameBoard(layout);
  var index = 0;
  var moves = 0;

  function iterate() {
    if (index === solution.length) {
      return callback(undefined, {
        valid: gameBoard.complete(),
        moves: moves
      });
    }
    var step = solution[index];
    if (gameBoard.move(step.x, step.y, step.left)) {
      moves += 1;
    }
    index += 1;
    process.nextTick(iterate);
  }

  process.nextTick(iterate);
}

module.exports.check = check;
