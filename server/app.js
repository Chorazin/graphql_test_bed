const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');

const app = express();
//setup middleware
app.use('/graphql', graphqlHTTP({
  //setup schema
  schema,
  graphiql: true
}));


app.listen(4000, () => {
  console.log('now listening to requests on port 4000');
});