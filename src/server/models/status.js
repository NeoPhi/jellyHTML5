var mongoose = require('mongoose');

var StatusModel;
var StatusSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  level: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  rating: {
    type: Number
  },
  clicks: {
    type: Number
  }
});

StatusSchema.index({
  user: 1,
  level: 1
});

function toClient() {
  return {
    rating: this.rating,
    clicks: this.clicks
  };
}

StatusSchema.methods.toClient = toClient;

function findForUser(user, callback) {
  if (!user) {
    return process.nextTick(function() {
      callback(undefined, []);
    });
  }
  StatusModel.find({
    user: user._id
  }, callback);
}

function findByUserAndLevelId(user, levelId, callback) {
  if (!user || !levelId) {
    return process.nextTick(callback);
  }
  StatusModel.findOne({
    user: user._id,
    level: levelId
  }, callback);
}

StatusSchema.statics.findForUser = findForUser;
StatusSchema.statics.findByUserAndLevelId = findByUserAndLevelId;

StatusModel = mongoose.model('Status', StatusSchema);

module.exports.schema = StatusSchema;
module.exports.model = StatusModel;
