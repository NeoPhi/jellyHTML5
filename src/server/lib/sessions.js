var express = require('express');
var passport = require('passport');
var DailycredStrategy = require('passport-dailycred').Strategy;
var User = require('../models/user').model;
var RedisStore = require('connect-redis')(express);

var CALLBACK_URL = '/auth/dailycred/callback';

var dailycredStrategy = new DailycredStrategy({
  clientID: process.env.DAILY_CRED_ID,
  clientSecret: process.env.DAILY_CRED_SECRET,
  callbackURL: process.env.URL_BASE + CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
  User.findByDailyCredId(profile.id, function(err, user) {
    if (err || user) {
      return done(err, user.toJSON());
    }
    user = new User({
      dailyCredId: profile.id,
      email: profile.email,
      picture: profile._json.picture
    });
    user.save(function(err) {
      done(err, user.toJSON());
    });
  });
});

passport.use(dailycredStrategy);

// To prevent the need to load the user from Mongo every time
// the strategy returns a minimal JSON representation that is
// passed as is into the serialize and deserialize methods
passport.serializeUser(function(user, done) {
  done(undefined, user);
});

passport.deserializeUser(function(user, done) {
  done(undefined, user);
});

function addMiddleware(app) {
  app.use(express.session({
    secret: process.env.SESSION_SECRET,
    key: 'sid',
    store: new RedisStore()
  }));
  app.use(passport.initialize());
  app.use(passport.session());
}

function addRoutes(app) {
  app.get('/auth/signup', passport.authenticate(dailycredStrategy.name));

  app.get('/auth/signin', passport.authenticate(dailycredStrategy.name, {
    action: 'signin'
  }));

  app.get(CALLBACK_URL, passport.authenticate(dailycredStrategy.name, {
    failureRedirect: '/'
  }), function(req, res) {
    res.redirect('/');
  });

  app.get('/auth/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

module.exports.addMiddleware = addMiddleware;
module.exports.addRoutes = addRoutes;
