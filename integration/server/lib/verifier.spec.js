describe('server/lib/verifier', function() {
  var mongoose = require('mongoose');
  var Level = require('../../../src/server/models/level').model;
  var verifier = require('../../../src/server/lib/verifier');
  var async = require('async');

  beforeEach(function() {
    var connected = false;
    mongoose.connect(process.env.MONGODB_URL, function(err) {
      if (err) {
        throw err;
      }
      connected = true;
    });
    waitsFor(function() {
      return connected;
    });
  });

  afterEach(function() {
    var disconnected = false;
    mongoose.disconnect(function(err) {
      if (err) {
        throw err;
      }
      disconnected = true;
    });
    waitsFor(function() {
      return disconnected;
    });
  });

  it('solves all levels', function() {
    var complete = false;
    Level.find({}, '+layout +solution', function(err, levels) {
      if (err) {
        throw err;
      }
      async.forEach(levels, function(level, asyncCallback) {
        var layout = JSON.parse(level.layout);
        var solution = JSON.parse(level.solution);
        if (solution.length === 0) {
          return process.nextTick(asyncCallback);
        }
        verifier.check(layout, solution, function(err, result) {
          if (err) {
            return asyncCallback(err);
          }
          expect(result.valid).toBe(true, level.name);
          expect(result.moves).toBe(level.moves);
          asyncCallback();
        });
      }, function(err) {
        expect(err).toBeFalsy();
        complete = true;
      });
    });
    waitsFor(function() {
      return complete;
    });
  });
});
