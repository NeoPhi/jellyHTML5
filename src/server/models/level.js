var mongoose = require('mongoose');

var LevelModel;
var LevelSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  layout: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  }
});

function toClient(summary, status) {
  var result = {
    id: this.id.toString(),
    name: this.name
  };
  if (!summary) {
    result.layout = JSON.parse(this.layout);
  }
  if (status) {
    result.status = status.toClient();
  }
  return result;
}

LevelSchema.methods.toClient = toClient;

LevelModel = mongoose.model('Level', LevelSchema);

module.exports.schema = LevelSchema;
module.exports.model = LevelModel;
