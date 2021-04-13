const db = require('mongoose');

const BlacklistSchema = db.Schema({
  _id: db.Schema.Types.ObjectId,
  username: String,
  userId: {
    type: String,
    unique: true
  },
  reason: String,
  reportedBy: String,
  reportedById: String
});

module.exports = db.model("Blacklist", BlacklistSchema);
