var core = require('../../client/core');

function check(layout, solution, callback) {
  var gameBoard = core.createGameBoard(layout);
  var index = 0;
  var clicks = 0;

  function iterate() {
    if (index === solution.length) {
      return callback(undefined, {
        valid: gameBoard.complete(),
        clicks: clicks
      });
    }
    var step = solution[index];
    if (gameBoard.click(step.x, step.y, step.left)) {
      clicks += 1;
    }
    index += 1;
    process.nextTick(iterate);
  }

  process.nextTick(iterate);
}

module.exports.check = check;
