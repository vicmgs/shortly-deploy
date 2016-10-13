

var mongoose = require('mongoose');
var database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/penisDB');

database.urlsSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

database.usersSchema = new mongoose.Schema({
  username: String,
  password: String
});
module.exports = database;
