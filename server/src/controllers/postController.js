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
  body('author').not().isEmpty().withMessage('Must provide an author ID').trim(),
  body('timestamp').not().isEmpty().withMessage('Missing timestamp')
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
    timestamp: req.body.timestamp,
    photo: req.body.photo || '',
    likes: []
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


exports.getRelevantPosts = (req, res) => {
  User.findById(req.params.userid, (userErr, user) => {
    if (userErr) {
      return res.status(500).json({
        message: 'An internal error occurred.',
        details: userErr
      })
    }
    
    const friendList = user.friends;
    friendList.push(req.params.userid);
    
    Post.find({ author: {$in: friendList} }).sort({ timestamp: -1 }).limit(30).lean().populate('author')
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
  });
}


exports.likePost = (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({
      message: 'Bad request.',
      details: ['Missing user ID.']
    });
  }
  
  Post.findById(req.params.postid) 
  .then((post) => {
    if (!post) {
      return res.status(404).json({
        message: 'Post not found.'
      });
    }
    
    const likes = [...post.likes];
    const foundUser = likes.find((user) => user.toString() === req.body._id);
    
    if (foundUser !== undefined) {
      return res.status(403).json({
        message: 'Forbidden',
        details: ['User has already liked the post.']
      })
    }
    
    likes.push(req.body._id);
    
    Post.updateOne({ _id: req.params.postid }, { likes })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      throw err;
    })
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.dislikePost = (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({
      message: 'Bad request.',
      details: ['Missing user ID.']
    });
  }
  
  Post.findById(req.params.postid) 
  .then((post) => {
    if (!post) {
      return res.status(404).json({
        message: 'Post not found.'
      });
    }
    
    if (post.likes.indexOf(req.body._id) === -1) {
      return res.status(403).json({
        message: 'Forbidden',
        details: ['User has not liked the post before.']
      })
    }
    
    const likes = [...post.likes].filter((user) => user._id.toString() !== req.body._id);
    
    Post.updateOne({ _id: req.params.postid }, { likes })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      throw err;
    })
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}