var Level = require('../models/level').model;
var Status = require('../models/status').model;
var verifier = require('./verifier');
var async = require('async');

// TODO introduce domains or wrappers to reduce repeated code
function loadLevel(user, id, callback) {
  async.parallel({
    level: function(asyncCallback) {
      Level.findById(id, asyncCallback);
    },
    status: function(asyncCallback) {
      Status.findByUserAndLevelId(user, id, asyncCallback);
    }
  }, function(err, results) {
    if (err) {
      return callback(err);
    }
    if (!results.level) {
      return callback(new Error('Level not found: ' + id));
    }
    callback(undefined, results);
  });
}

function listLevels(req, res, next) {
  // TODO limit number of levels loaded/returned which would
  // also mean limiting the status lookup to those levels
  async.parallel({
    levels: function(asyncCallback) {
      Level.find({}, asyncCallback);
    },
    statuses: function(asyncCallback) {
      Status.findForUser(req.user, asyncCallback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    var statusLookup = {};
    results.statuses.forEach(function(status) {
      statusLookup[status.level.toString()] = status;
    });
    res.send(results.levels.map(function(level) {
      return level.toClient(true, statusLookup[level.id.toString()]);
    }));
  });
}

function returnLevel(req, res, next) {
  var id = req.params.id;
  loadLevel(req.user, id, function(err, results) {
    if (err) {
      return next(err);
    }
    res.send(results.level.toClient(false, results.status));
  });
}

function verifyLevel(req, res, next) {
  var id = req.params.id;
  var solution = req.body.solution;
  if (!solution || (solution.length === 0)) {
    return next(new Error('No solution provided'));
  }
  loadLevel(req.user, id, function(err, results) {
    if (err) {
      return next(err);
    }
    verifier.check(JSON.parse(results.level.layout), solution, function(err, result) {
      if (err) {
        return next(err);
      }
      if (!req.user) {
        return res.send(result);
      }
      var status = results.status;
      if (!status) {
        status = new Status({
          user: req.user._id,
          level: id
        });
      }
      if (!status.clicks || (result.clicks < status.clicks)) {
        status.clicks = result.clicks;
      }
      status.save(function(err) {
        if (err) {
          return next(err);
        }
        res.send(result);
      });
    });
  });
}

function addRoutes(app) {
  app.get('/levels/', listLevels);

  app.get('/levels/:id', returnLevel);

  app.post('/levels/:id/verify', verifyLevel);
}

module.exports.addRoutes = addRoutes;
