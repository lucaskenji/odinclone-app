const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (username, password, done) => {
      User.findOne({email: username}, (err, user) => {
        if (err) {
          return done(err);
        }
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        
        bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return done(null, false, { message: 'Incorrect password. '});
          }
          
          return done(null, user);
        })
      }).select("+password")
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
})

passport.deserializeUser((id, done) => {
  User.findById(id).select("+password").lean()
  .then((user) => {
    done(null, user);
  })
  .catch((err) => {
    done(err, false);
  });
});