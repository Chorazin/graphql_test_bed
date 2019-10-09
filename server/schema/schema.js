const graphql = require('graphql');

const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList
} = graphql;

//dummy test data, will set this up in firebase or mongodb eventually and plug it in
const movies = [
  {name: 'Ghostbusters', genre: 'Comedy', id: '1', director_id: '1'},
  {name: 'The Blues Brothers', genre: 'Musical', id: '2', director_id: '2'},
  {name: 'Predator', genre: 'Action', id: '3', director_id: '3'},
  {name: 'Big Trouble in Little China', genre: 'Adventure', id: '4', director_id: '4'},
  {name: 'Escape from New York', genre: 'Sci Fi', id: '5', director_id: '4'},
  {name: 'Stripes', genre: 'Comedy', id: '6', director_id: '1'},
  {name: 'They Live', genre: 'Sci Fi', id: '7', director_id: '4'}
];

const directors = [
  {name: 'Ivan Reitman', age: 72, id: '1'},
  {name: 'John Landis', age: 69, id: '2'},
  {name: 'John McTiernan', age: 68, id: '3'},
  {name: 'John Carpenter', age: 71, id: '4'}
];

//create object types for movies and directors
//movie type
const Movie = new GraphQLObjectType({
  name: 'Movie',
  //wrap the properties in a function because no one wants that catch22 Director/Moive is not defined
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    director: {
      type: Director,
      resolve(parent, args) {
        let found = directors.find((elem) => {
          return elem.id == parent.director_id
        });
        return found;
      }
    }
  })
});

//director type
const Director = new GraphQLObjectType({
  name: 'Director',
  //wrap the properties in a function because no one wants that catch22 Director/Moive is not defined
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    movies: {
      type: new GraphQLList(Movie),
      resolve(parent, args) {
        //search the movies array based on the parent Director ID and make a list of movies by that director
        let filtered_list = movies.filter((elem) => {
          if(elem.director_id == parent.id) {
            return true;
          }
        });
        return filtered_list;
      }
    }
  })
});






//set up jump in point for the graph to query data
const RootQuery = new GraphQLObjectType({

  name: 'RootQueryType',
  fields: {
    //movie jump in
    movie: {
      type: Movie,
      args: { id: {type: GraphQLID}},
      resolve(parent, args) {
        //look through the movies array for a matching id to the query
        let found = movies.find((elem) => {
          return elem.id == args.id;
        });
        return found;
      }
    },
    //director jump in
    director: {
      type: Director,
      args: { id: {type: GraphQLID}},
      resolve(parent, args) {
        //look through the directors array for a matching id to the qury
        let found = directors.find((elem) => {
          return elem.id == args.id;
        });
        return found;
      }
    },
    //movies list, wanting to just grab all movies seems reasonable
    movie_list: {
      type: new GraphQLList(Movie),
      resolve(parent, args){
        return movies;
      }
    },
    //director list, wanting to grab all directors seems reasonable
    director_list: {
      type: new GraphQLList(Director),
      resolve(parent, args) {
        return directors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
