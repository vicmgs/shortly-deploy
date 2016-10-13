var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
db.urlsSchema.pre('save', function(next) {
  var link = this;

  // if (!link.isModified('code')) return next();

  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
});

var mLink = mongoose.model('link', db.urlsSchema);




module.exports = mLink;
