var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
  // comparePassword: function(attemptedPassword, callback) {
  //   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
  //     callback(isMatch);
  //   });
  // },
  // hashPassword: function() {
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
// });

db.usersSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});


var User = mongoose.model('User', db.usersSchema);

User.hashPassword = function(pass) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(pass, null, null);
};

User.comparePassword = function(password, hash) {
  console.log('password: ' + password);
  console.log('hash: ' + hash);
  var compare = Promise.promisify(bcrypt.compare);
  return compare(password, hash);
};

module.exports = User;
