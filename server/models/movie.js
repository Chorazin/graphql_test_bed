const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Movie_Schema = new schema({
  name: String,
  genre: String,
  director_id: String
});

module.exports = mongoose.model('Movie', Movie_Schema);
