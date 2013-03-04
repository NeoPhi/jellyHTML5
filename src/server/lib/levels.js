var Level = require('../models/level').model;

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

function loadLevel(req, res, next) {
  var id = req.params.id;
  Level.findById(id, function(err, level) {
    if (err) {
      return next(err);
    }
    if (!level) {
      return next(new Error('Level not found: ' + id));
    }
    res.send(level.toClient());
  });
}

function addRoutes(app) {
  app.get('/levels/', listLevels);

  app.get('/levels/:id', loadLevel);
}

module.exports.addRoutes = addRoutes;
