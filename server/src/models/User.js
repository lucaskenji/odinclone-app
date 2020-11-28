const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  birthDate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  photo: {
    type: String,
    default: ''
  },
  facebookId: {
    type: String
  },
  isGuest: {
    type: Boolean
  }
});

const User = mongoose.model('User', userSchema);


module.exports = User;