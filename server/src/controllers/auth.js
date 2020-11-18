const passport = require('passport');
const jwt = require('jsonwebtoken');
const Tokens = require('csrf');
const tokens = new Tokens();

exports.checkReferer = (req, res, next) => {
  const referer = req.get('Referer');
  const url = new RegExp(process.env.FRONTEND_URL);
  
  if (url.test(referer)) {
    next();
  } else {
    return res.status(403).json({
      message: 'Access denied'
    });
  }
}

exports.authenticate = (req, res) => {
  // two csrf values are sent, one as a header and one in the jwt payload
  // they are both compared later at verifyToken
  const csrfToken = tokens.create(process.env.CSRF_SECRET);
  
  jwt.sign({ csrf: csrfToken }, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      console.log('Error on JWT.');
    }
    
    res.cookie('jwtToken', token, { httpOnly: true });
    res.header('CSRF', csrfToken);
    
    return res.json({
      message: 'Successfully logged',
      id: req.user._id
    });
  });
}

exports.verifyToken = (req, res, next) => {
  jwt.verify(req.cookies.jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error',
        details: ['Failed to decode JWT token']
      });
    }
    
    if (decoded.csrf !== req.headers.csrf) {
      return res.status(401).json({
        message: 'Unauthenticated',
        details: ['CSRF value does not match']
      });
    }
    
    next();
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

exports.logout = (req, res) => {
  req.logout();
  return res.json({
    message: 'Successfully logged out'
  });
}

exports.facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect(process.env.FRONTEND_URL); }
    
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      
      const csrfToken = tokens.create(process.env.CSRF_SECRET);
      
      jwt.sign({ csrf: csrfToken }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          console.log('Error on JWT.');
        }
        
        res.cookie('jwtToken', token, { httpOnly: true });
        res.cookie('CSRF', csrfToken);
        
        return res.redirect(process.env.FRONTEND_URL + '/redirect');
      });
    })
  })(req, res, next);
}