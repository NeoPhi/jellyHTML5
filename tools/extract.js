var mongoose = require('mongoose');
var Level = require('../src/server/models/level').model;
var config = require('../src/server/lib/config');
var async = require('async');
var fs = require('fs');
var path = require('path');

mongoose.connect(config.mongo.url, function(err) {
  if (err) {
    throw err;
  }
});

Level.find({}, '+layout +solution', function(err, levels) {
  if (err) {
    throw err;
  }
  async.forEach(levels, function(level, asyncCallback) {
    var layout = JSON.parse(level.layout);
    var solution = JSON.parse(level.solution);

    var data = {
      name: level.name,
      index: level.index,
      layout: layout,
      solution: solution
    };

    var file = level.index + '.json';
    if (level.index < 10) {
      file = '0' + file;
    }
    fs.writeFile(path.join('tools', 'levels', file), JSON.stringify(data, null, '  '), asyncCallback);
  }, function(err) {
    if (err) {
      throw err;
    }
    process.exit(0);
  });
});
