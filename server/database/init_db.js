const mongoose = require('mongoose');

exports.init_mongo_db = () => {
  mongoose.connect('mongodb+srv://Chorazin:Explicit6669@graphql-test-bed-sfjav.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connection.once('open', () => {
    console.log('connected to database');
  });
}
