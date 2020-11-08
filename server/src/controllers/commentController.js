const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');

exports.getAllComments = (req, res) => {
  Comment.find({ post: req.params.postid }).populate('author').populate('post')
  .then((comments) => {
    if (comments.length === 0) {
      return res.status(404).json({
        message: 'Comments not found'
      });
    }
    
    return res.json(comments);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.getCommentWithId = (req, res) => {
  Comment.findById(req.params.commentid)
  .then((comment) => {
    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found.'
      })
    }
    
    res.json(comment);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.commentValidation = [
  body('content').not().isEmpty().withMessage('Must provide some content.').trim(),
  body('author').not().isEmpty().withMessage('Must provide an author ID.').trim()
];


exports.createComment = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Bad request.',
      details: errors.array()
    });
  }
  
  const commentAuthor = await User.findById(req.body.author);
  
  if (!commentAuthor) {
    return res.status(400).json({
      message: 'Bad request.',
      details: ['Author ID provided does not return any users.']
    })
  }
  
  const commentPost = await Post.findById(req.params.postid);
  
  if (!commentPost) {
    return res.status(400).json({
      message: 'Bad request.',
      details: ['Post ID provided does not return any posts.']
    });
  }
  
  const newComment = new Comment({
    content: req.body.content,
    author: req.body.author,
    post: req.params.postid,
    likes: 0
  });
  
  try {
    const commentResult = await newComment.save();
    return res.json(commentResult);
  } catch (err) {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  }
}


exports.updateValidation = [
  body('content').optional().not().isEmpty().withMessage('Must provide some content.').trim()
];


exports.updateComment = (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Bad request.',
      details: errors.array()
    });
  }
  
  const updatedData = {...req.body};
  
  Comment.updateOne({_id: req.params.commentid}, updatedData)
  .then((updateResult) => {
    if (updateResult.nModified !== 1) {
      throw new Error('Update result did not return nModified as 1');
    }
    
    return res.json({...updatedData, _id: req.params.commentid});
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  })
}


exports.deleteComment = async (req, res) => {
  const deleteResult = await Comment.deleteOne({ _id: req.params.commentid });
  
  if (deleteResult.deletedCount === 1) {
    return res.json({ _id: req.params.commentid });
  } else {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: ['Deleted count did not return 1.']
    });
  }
}