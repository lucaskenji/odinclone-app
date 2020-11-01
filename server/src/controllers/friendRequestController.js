const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

exports.getAllRequests = (req, res) => {
  FriendRequest.find().lean().populate('sender').populate('receiver')
  .then((results) => {
    if (results.length === 0) {
      return res.status(404).json({
        message: 'No requests found.'
      });
    }
    
    return res.json(results);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    });
  })
}


exports.getRequestWithId = (req, res) => {
  FriendRequest.findById(req.params.requestid).lean().populate('sender').populate('receiver')
  .then((request) => {
    if (!request) {
      return res.status(404).json({
        message: 'Request not found.'
      });
    }
    
    return res.json(request);
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    });
  })
}


exports.requestValidation = async (req, res, next) => {
  try {
    if (!req.body.sender || !req.body.receiver) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['Sender or receiver not provided.']
      })
    }
    
    if (req.body.sender === req.body.receiver) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['Sender or receiver not provided.']
      })
    }

    const senderUser = await User.findById(req.body.sender);
    const receiverUser = await User.findById(req.body.receiver);
    
    if (!senderUser || !receiverUser) {
      return res.status(400).json({
        message: 'Bad request.',
        details: ['The sender or receiver specified does not exist.']
      });
    }
    
    return next();
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  }
}


exports.createRequest = async (req, res) => {
  try {
    const newRequest = new FriendRequest({
      sender: req.body.sender,
      receiver: req.body.receiver
    });
    const saveResult = await newRequest.save();
    
    return res.json(saveResult);
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  }
}


exports.updateRequest = (req, res) => {
  FriendRequest.updateOne({ _id: req.params.requestid })
  .then((result) => {
    return res.json({ _id: req.params.requestid });
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  })
}


exports.deleteRequest = (req, res) => {
  FriendRequest.deleteOne({ _id: req.params.requestid })
  .then((result) => {
    return res.json({ _id: req.params.requestid });
  })
  .catch((err) => {
    return res.status(500).json({
      message: 'Internal server error.',
      details: err
    })
  })
}