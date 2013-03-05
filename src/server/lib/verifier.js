var core = require('../../client/core');

function check(layout, solution, callback) {
  var gameBoard = core.createGameBoard(layout);
  var index = 0;

  function iterate() {
    if (index === solution.length) {
      return callback(undefined, gameBoard.complete());
    }
    var step = solution[index];
    gameBoard.click(step.x, step.y, step.left);
    index += 1;
    process.nextTick(iterate);
  }

  process.nextTick(iterate);
}

module.exports.check = check;
