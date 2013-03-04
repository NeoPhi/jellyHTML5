var mongoose = require('mongoose');

var UserModel;
var UserSchema = mongoose.Schema({
  dailyCredId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true
  },
  picture: {
    type: String
  }
});

function findByDailyCredId(dailyCredId, callback) {
  UserModel.findOne({
    dailyCredId: dailyCredId
  }, callback);
}

UserSchema.statics.findByDailyCredId = findByDailyCredId;

UserModel = mongoose.model('User', UserSchema);

module.exports.schema = UserSchema;
module.exports.model = UserModel;
