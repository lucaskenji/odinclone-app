const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;