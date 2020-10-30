const passport = require('passport');

exports.authenticate = (req, res) => {
  return res.json({
    message: 'Successfully logged',
    id: req.user._id
  });
}

exports.checkAuth = (req, res) => {  
  if (req.user) {
    return res.json({
      isLogged: true,
      id: req.user._id
    });
  }
  
  return res.json({
    isLogged: false,
    id: null
  });
}