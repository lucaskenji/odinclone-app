const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const FriendRequest = require('../models/FriendRequest');
const Post = require('../models/Post');


exports.getAllUsers = (req, res) => {
  User.find().lean().populate('friends')
  .then((users) => {
    if (users.length === 0) {
      return res.status(404).json({
        message: 'No users found.'
      });
    }
    
    res.json(users);
  })
  .catch((err) => {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  });
}


exports.getUserWithId = (req, res) => {
  User.findById(req.params.userid).populate('friends')
  .then((user) => {
    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      })
    }
    
    res.json(user);
  })
  .catch((err) => {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.registerValidation = [
  body('firstName').not().isEmpty().withMessage('You must provide your first name.').trim(),
  body('lastName').not().isEmpty().withMessage('You must provide your last name.').trim(),
  body('email').not().isEmpty().withMessage('You must provide an email.'),
  body('email').isEmail().withMessage('The email provided is invalid.').trim(),
  body('password').not().isEmpty().withMessage('You must provide a password.').trim(),
  body('birthDate').not().isEmpty().withMessage('You must provide a valid birth date.').trim(),
  body('gender').not().isEmpty().withMessage('You must provide your gender.').trim()
];


exports.userValidation = (req, res, next) => {
  const errors = validationResult(req);
      
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Bad request.',
      details: errors.array({ onlyFirstError: true })
    });
  }
  
  User.findOne({ email: req.body.email })
  .then((user) => {
    if (user && typeof req.params.userid === 'undefined') {   
      return res.status(409).json({
        message: 'Conflict.',
        details: ['The email provided is already in use.']
      });
    }
    
    if (user && user._id.toString() !== req.params.userid) {
      return res.status(409).json({
        message: 'Conflict.',
        details: ['The email provided is already in use.']
      });
    }
    
    next();
  })
  .catch((err) => {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    })
  })
}


exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      friends: [],
      isGuest: req.body.isGuest ? true : false
    });
    
    const newDocument = await newUser.save();
    
    return res.json(newDocument);
  } catch (err) {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });  
  }
}


exports.updateValidation = [
  body('firstName').optional().not().isEmpty().withMessage('First name not provided').trim(),
  body('lastName').optional().not().isEmpty().withMessage('Last name not provided').trim(),
  body('email').optional().not().isEmpty().withMessage('E-mail not provided').trim(),
  body('password').optional().not().isEmpty().withMessage('Password not provided').trim(),
  body('birthDate').optional().not().isEmpty().withMessage('Birth date not provided').trim(),
  body('gender').optional().not().isEmpty().withMessage('Gender not provided').trim()
];


exports.updateUser = async (req, res) => {
  let hashedPassword = '';
  
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
      res.status(500).json({
        message: 'An internal error occurred.',
        details: err
      });  
    }
  }
  
  const updatedData = {...req.body};
  
  if (req.body.password) {
    delete updatedData.password;
    updatedData.password = hashedPassword;
  }
  
  const updateResult = await User.updateOne({_id: req.params.userid}, updatedData );
  
  if (updateResult.nModified === 1) {
    return res.json({ ...updatedData, _id: req.params.userid });
  } else {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: ['Update result did not return 1.']
    });
  }
}


exports.deleteUser = async (req, res) => {  
  const deleteResult = await User.deleteOne({ _id: req.params.userid });
  
  if (deleteResult.deletedCount === 1) {
    return res.json({ _id: req.params.userid });
  } else {
    res.status(500).json({
      message: 'An internal error occurred.',
      details: ['Deleted count did not return 1.']
    });
  }
}


exports.getUserFriendRequests = (req, res) => {
  FriendRequest.find({ receiver: req.params.userid }).lean().populate('sender').populate('receiver')
  .then((results) => {
    if (results.length === 0) {
      return res.status(404).json({
        message: 'No requests found',
      });
    }
    
    return res.json(results);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'An internal error occurred.',
      details: err
    });
  })
}


exports.addFriend = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['User id was not sent on request body']
      });
    }
      
    const userToAdd = await User.findById(req.body._id);
    
    if (!userToAdd) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['ID sent on request body returns no user']
      });
    }
    
    const userRequested = await User.findById(req.params.userid);
    
    if (userRequested.friends.indexOf(req.body._id) !== -1) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['User already has the requester ID on friend array.']
      })
    }
    
    userRequested.friends.push(req.body._id);
    
    const saveResult = userRequested.save();
    return res.json( saveResult );
  } catch(err) {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  }
}


exports.removeFriend = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['User id was not sent on request body']
      });
    }

    const user = await User.findById(req.params.userid);
    
    if (!user) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['User does not exist.']
      })
    }
    
    user.friends = [...user.friends].filter((friend) => friend.toString() !== req.body._id);
    
    const updateResult = await User.updateOne({ _id: req.params.userid }, { friends: user.friends });
    
    return res.json( updateResult );
  } catch(err) {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  }
}


exports.getUserPosts = (req, res) => {
  Post.find({ author: req.params.userid }).sort({ timestamp: -1 }).populate('author')
  .then((posts) => {
    if (posts.length === 0) {
      return res.status(404).json({
        message: 'No posts found.'
      });
    }
    
    return res.json(posts);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    });
  })
}


exports.searchUser = (req, res) => {
  let query = req.params.pattern.split(' ');

  if (query.length === 1) {
    query = [req.params.pattern, req.params.pattern];
  }
  
  User.find({
    $or: [
      {firstName: {$regex: query[0], $options: 'i'}}, 
      {lastName: {$regex: query[1], $options: 'i'}}
    ],
    isGuest: { $ne: true }
  })
  .then((matches) => {
    if (matches.length === 0) {
      return res.status(404).json({
        message: 'No matches found'
      });
    }
    
    return res.json(matches);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  })
}
