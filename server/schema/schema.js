const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

//dummy test data
const movies = [
  {name: 'Ghostbusters', genre: 'Comedy', id: '1'},
  {name: 'The Blues Brothers', genre: 'Musical', id: '2'},
  {name: 'Predator', genre: 'Action', id: '3'}
];


const Movie = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    genre: {type: GraphQLString}
  })
});

//set up jump in point for the graph to query data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: Movie,
      args: { id: {type: GraphQLString}},
      resolve(parent, args) {
        //look through the movies array for a matching id to the query
        let found = movies.find((elem) => {
          return elem.id == args.id;
        });
        return found;
        //code to get data from db / other source
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
