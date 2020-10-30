const passport = require('passport');

exports.authenticate = (req, res) => {
  return res.json({
    message: 'success!'
  });
}

exports.checkAuth = (req, res) => {  
  if (req.user) {
    return res.json({ isLogged: true });
  }
  
  return res.json({ isLogged: false });
}