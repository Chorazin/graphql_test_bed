const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Director_Schema = new schema({
  name: String,
  age: Number
});

module.exports = mongoose.model('Director', Director_Schema);
