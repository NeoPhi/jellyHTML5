describe('server/lib/verifier', function() {
  var verifier = require('../../../src/server/lib/verifier');
  var game = require('../../../src/shared/game');

  var done;
  var gameBoard;

  beforeEach(function() {
    done = false;
    gameBoard = {
      move: jasmine.createSpy(),
      complete: jasmine.createSpy()
    };
    spyOn(game, 'createGameBoard').andReturn(gameBoard);
  });

  afterEach(function() {
    waitsFor(function() {
      return done;
    });
  });

  describe('check', function() {
    it('handles no solution', function() {
      gameBoard.complete.andReturn(false);
      verifier.check('LAYOUT', [], function(err, result) {
        if (err) {
          throw err;
        }
        expect(game.createGameBoard.callCount).toBe(1);
        expect(game.createGameBoard.argsForCall[0][0]).toBe('LAYOUT');
        expect(gameBoard.move.callCount).toBe(0);
        expect(gameBoard.complete.callCount).toBe(1);
        expect(result).toEqual({
          valid: false,
          moves: 0
        });
        done = true;
      });
    });

    it('handles multiple step solution', function() {
      gameBoard.move.andReturn(true);
      gameBoard.complete.andReturn(true);
      verifier.check('LAYOUT', [{
        x: 1,
        y: 1,
        left: false
      }, {
        x: 2,
        y: 1,
        left: true
      }], function(err, result) {
        if (err) {
          throw err;
        }
        expect(game.createGameBoard.callCount).toBe(1);
        expect(game.createGameBoard.argsForCall[0][0]).toBe('LAYOUT');
        expect(gameBoard.move.callCount).toBe(2);
        expect(gameBoard.move.argsForCall[0][0]).toBe(1);
        expect(gameBoard.move.argsForCall[0][1]).toBe(1);
        expect(gameBoard.move.argsForCall[0][2]).toBe(false);
        expect(gameBoard.move.argsForCall[1][0]).toBe(2);
        expect(gameBoard.move.argsForCall[1][1]).toBe(1);
        expect(gameBoard.move.argsForCall[1][2]).toBe(true);
        expect(gameBoard.complete.callCount).toBe(1);
        expect(result).toEqual({
          valid: true,
          moves: 2
        });
        done = true;
      });
    });
  });
});
