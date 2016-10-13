var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

db.urlsSchema.pre('save', function(next) {
  var link = this;

  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
});

var mLink = mongoose.model('link', db.urlsSchema);




module.exports = mLink;
