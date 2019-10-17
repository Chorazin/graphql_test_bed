const mongoose = require('mongoose');


module.exports = {
  init_mongo_db: function() {
    mongoose.connect('mongodb+srv://Chorazin:Explicit6669@graphql-test-bed-sfjav.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true});
    mongoose.connection.once('open', () => {
      console.log('connected to remote mongodb');
    });
  }
};
