describe('server/lib/verifier', function() {
  var verifier = require('../../../src/server/lib/verifier');
  var core = require('../../../src/client/core');

  var done;
  var gameBoard;

  beforeEach(function() {
    done = false;
    gameBoard = {
      click: jasmine.createSpy(),
      complete: jasmine.createSpy()
    };
    spyOn(core, 'createGameBoard').andReturn(gameBoard);
  });

  afterEach(function() {
    waitsFor(function() {
      return done;
    });
  });

  describe('check', function() {
    it('handles no solution', function() {
      gameBoard.complete.andReturn(false);
      verifier.check('LAYOUT', [], function(err, valid) {
        if (err) {
          throw err;
        }
        expect(core.createGameBoard.callCount).toBe(1);
        expect(core.createGameBoard.argsForCall[0][0]).toBe('LAYOUT');
        expect(gameBoard.click.callCount).toBe(0);
        expect(gameBoard.complete.callCount).toBe(1);
        expect(valid).toBe(false);
        done = true;
      });
    });

    it('handles multiple step solution', function() {
      gameBoard.complete.andReturn(true);
      verifier.check('LAYOUT', [{
        x: 1,
        y: 1,
        left: false
      }, {
        x: 2,
        y: 1,
        left: true
      }], function(err, valid) {
        if (err) {
          throw err;
        }
        expect(core.createGameBoard.callCount).toBe(1);
        expect(core.createGameBoard.argsForCall[0][0]).toBe('LAYOUT');
        expect(gameBoard.click.callCount).toBe(2);
        expect(gameBoard.click.argsForCall[0][0]).toBe(1);
        expect(gameBoard.click.argsForCall[0][1]).toBe(1);
        expect(gameBoard.click.argsForCall[0][2]).toBe(false);
        expect(gameBoard.click.argsForCall[1][0]).toBe(2);
        expect(gameBoard.click.argsForCall[1][1]).toBe(1);
        expect(gameBoard.click.argsForCall[1][2]).toBe(true);
        expect(gameBoard.complete.callCount).toBe(1);
        expect(valid).toBe(true);
        done = true;
      });
    });
  });
});
