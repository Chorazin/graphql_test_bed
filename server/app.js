const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const init_db = require('./database/init_db.js');


const app = express();

//initialise the databse connection, I chose to put this in it's own file so i can gitignore it
init_db.init_mongo_db();

//setup middleware
app.use('/graphql', graphqlHTTP({
  //setup schema
  schema,
  graphiql: true
}));


app.listen(4000, () => {
  console.log('now listening to requests on port 4000');
});
