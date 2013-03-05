var Level = require('../models/level').model;
var verifier = require('./verifier');

function loadLevel(id, error, success) {
  Level.findById(id, function(err, level) {
    if (err) {
      return error(err);
    }
    if (!level) {
      return error(new Error('Level not found: ' + id));
    }
    success(level);
  });
}

function listLevels(req, res, next) {
  Level.find({}, function(err, levels) {
    if (err) {
      return next(err);
    }
    res.send(levels.map(function(level) {
      return level.toClient(true);
    }));
  });
}

function returnLevel(req, res, next) {
  var id = req.params.id;
  loadLevel(id, next, function(level) {
    res.send(level.toClient());
  });
}

function verifyLevel(req, res, next) {
  var id = req.params.id;
  loadLevel(id, next, function(level) {
    verifier.check(level.layout, req.body.solution, function(err, result) {
      if (err) {
        return next(err);
      }
      res.send({
        valid: result
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
