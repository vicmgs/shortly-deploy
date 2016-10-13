var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}).then(function(results) {
    res.status(200).send(results);
  });
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  var query = Link.findOne({url: uri});
  query.then(function(result) {
    if (result) {
      res.status(200).send(result);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        });
        newLink.save().then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = User.findOne({username: username});
  query.then(function(result) {
    if (!result) {
      res.redirect('/login');
    } else {
      User.comparePassword(password, result.password)
      .then(function(match) {
        if (match) {
          util.createSession(req, res, result);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = User.findOne({username: username});
  query.then(function(result) {
    if (!result) {
      new User({username: username, password: password}).save()
      .then(function(newUser) {
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });

};

exports.navToLink = function(req, res) {

  var query = Link.findOne({code: req.params[0]});
  query.then(function(result) {
    if (!result) {
      res.redirect('/');
    } else {
      result.visits++;
      result
      .save()
      .then(function(result) {
        console.log(result._id);
        console.log(result.visits);

        return res.redirect(result.url);
      });
    }
  });
};
