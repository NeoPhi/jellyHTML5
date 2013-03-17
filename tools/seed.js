var async = require('async');
var mongoose = require('mongoose');
var User = require('../src/server/models/user').model;
var Level = require('../src/server/models/level').model;
var config = require('../src/server/lib/config');
var fs = require('fs');
var path = require('path');

mongoose.connect(config.mongo.url);

var email = 'tatsunami.qrostar@gmail.com';

function createLevels(user, callback) {
  var author = user.id.toString();
  var dir = path.join('tools', 'levels');
  fs.readdir(dir, function(err, levels) {
    if (err) {
      return callback(err);
    }
    var levelNames = {};
    async.forEachSeries(levels, function(level, asyncCallback) {
      var levelData = JSON.parse(fs.readFileSync(path.join(dir, level)));

      if (levelNames.hasOwnProperty(levelData.name)) {
        throw new Error('Duplicate level: ' + levelData.name);
      }
      levelNames[levelData.name] = true;

      var moves = levelData.solution.length;
      levelData.author = author;
      if (levelData.layout.length !== 30) {
        throw new Error('Bad level: ' + levelData.name);
      }
      levelData.layout.forEach(function(row) {
        if (row.length !== 42) {
          throw new Error('Bad level: ' + levelData.name);
        }
      });
      levelData.layout = JSON.stringify(levelData.layout);
      levelData.solution = JSON.stringify(levelData.solution);
      levelData.moves = moves;

      Level.findOne({
        author: author,
        name: levelData.name
      }, function(err, level) {
        if (err) {
          return asyncCallback(err);
        }
        if (!level) {
          level = new Level({
            moves: 0,
            solution: JSON.stringify([])
          });
        }
        if ((levelData.moves === 0) || ((level.moves > 0) && (level.moves < levelData.moves))) {
          delete levelData.solution;
          delete levelData.moves;
        }
        for (var key in levelData) {
          if (levelData.hasOwnProperty(key)) {
            level[key] = levelData[key];
          }
        }
        level.save(asyncCallback);
      });
    }, callback);

  });
}

function createUser(callback) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err || user) {
      return callback(err, user);
    }
    user = new User({
      email: email
    });
    user.save(function(err) {
      callback(err, user);
    });
  });
}

createUser(function(err, user) {
  if (err) {
    throw err;
  }
  createLevels(user, function(err) {
    if (err) {
      throw err;
    }
    process.exit(0);
  });
});
