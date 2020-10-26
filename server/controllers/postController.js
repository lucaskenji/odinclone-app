const Post = require('../models/Post.js');
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');


exports.getAllPosts = (req, res) => {
  Post.find().lean().populate('author')
  .then((posts) => {
    if (posts.length === 0) {
      return res.status(404).json({
        message: 'No posts found.',
      });
    }
    
    return res.json(posts);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.getPostWithId = (req, res) => {
  Post.findById(req.params.postid).lean().populate('author')
  .then((post) => {
    if (!post) {
      return res.status(404).json({
        message: 'No post with such id found.'
      });
    }
    
    return res.json(post);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.postValidation = [
  body('content').not().isEmpty().withMessage('Must provide some content').trim(),
  body('author').not().isEmpty().withMessage('Must provide an author ID').trim()
];


exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Bad request.',
      details: errors.array()
    })
  }
  
  let postAuthor;
  
  try {
    postAuthor = await User.findOne({_id: req.body.author});
  } catch(err) {
    return res.status(500).json({
      message: 'An internal error occurred',
      details: err
    });
  }
  
  if (!postAuthor) {
    return res.status(400).json({
      message: 'Bad request.',
      details: ['Attempted to create a post with an user that does not exist.']
    })
  }
  
  const newPost = new Post({
    content: req.body.content,
    author: req.body.author,
    likes: 0
  });
  
  try {
    const postResult = await newPost.save();
    return res.json(postResult);
  } catch (err) {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  };
}


exports.updateValidation = [
  body('content').optional().not().isEmpty().withMessage('Must provide some content').trim()
];


exports.updatePost = (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Bad request.',
      details: errors.array()
    })
  }
  
  const updatedData = {...req.body};
  
  Post.updateOne({_id: req.params.postid}, updatedData)
  .then((updateResult) => {
    if (updateResult.nModified !== 1) {
      throw new Error('Update result did not return nModified as 1');
    }
    
    return res.json({...updatedData, _id: req.params.postid});
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  })
}


exports.deletePost = async (req, res) => {
  const deleteResult = await Post.deleteOne({ _id: req.params.postid });
  
  if (deleteResult.deletedCount === 1) {
    return res.json({ _id: req.params.postid });
  } else {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: ['Deleted count did not return 1.']
    });
  }
}