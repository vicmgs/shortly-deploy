var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var User = mongoose.model('User', db.usersSchema);

User.comparePassword = function(password, hash) {
  var compare = Promise.promisify(bcrypt.compare);
  return compare(password, hash);
};

db.usersSchema.pre('save', function(next) {
  var user = this;

  bcrypt.hash(user.password, null, null, function(err, hash) {
    user.password = hash;
    next();
  });
})

module.exports = User;
