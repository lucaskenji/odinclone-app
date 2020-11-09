const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/facebook/callback',
      profileFields: ['id', 'displayName', 'picture.type(large)']
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
          return done(err);
        }
        
        if (user) {
          return done(null, user);
        }
        
        let names = profile.displayName.split(' ');
        
        if (names.length !== 2) {
          // failed to get a first and last name
          names = [profile.displayName, ''];
        }
        
        const newUser = new User({
          firstName: names[0],
          lastName: names[1],
          email: profile.id,
          password: 'logged-by-facebook',
          birthDate: new Date(),
          gender: 'undefined',
          friends: [],
          photo: profile.photos ? profile.photos[0].value : '',
          facebookId: profile.id
        });
        
        newUser.save((err, createdUser) => {
          if (err) {
            return done(err);
          }
          
          return done(err, createdUser);
        })
      })
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