const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {type: String, required: true, unique: true,},
  email: {
    type: String,
    unique: true,
    trim: true, // trims whitespace if your user types something like " alex@123.com " into "alex@123.com"
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minLength: 3,
    required: true
  },
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
}, {
  timestamps: true,
  // A cool mongoose trick to not send passwords to clients! (even though they'll be hashed)
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
}) 

module.exports = mongoose.model('User', userSchema);