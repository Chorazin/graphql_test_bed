const graphql = require('graphql');
const movie_model = require('../models/movie.js');
const director_model = require('../models/director.js');

const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = graphql;


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
        return director_model.findById(parent.director_id);
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
        return movie_model.find({director_id: parent.id});
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
        return movie_model.findById(args.id);
      }
    },
    //director jump in
    director: {
      type: Director,
      args: { id: {type: GraphQLID}},
      resolve(parent, args) {
      return director_model.findById(args.id);
      }
    },
    //movies list, wanting to just grab all movies seems reasonable
    movie_list: {
      type: new GraphQLList(Movie),
      resolve(parent, args){
        return movie_model.find({});
      }
    },
    //director list, wanting to grab all directors seems reasonable
    director_list: {
      type: new GraphQLList(Director),
      resolve(parent, args) {
        return director_model.find({});
      }
    }
  }
});

//set up mutations for adding Movies and Directors
const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    //add a director mutation
    add_director: {
      type: Director,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },

      resolve(parent, args) {
        let director = new director_model({
          name: args.name,
          age: args.age
        });

        return director.save();
      }
    },
    //add a movie mutation
    add_movie: {
      type: Movie,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        director_id: {type: new GraphQLNonNull(GraphQLID)}
      },

      resolve(parent, args) {
        let movie = new movie_model({
          name: args.name,
          genre: args.genre,
          director_id: args.director_id
        });

        return movie.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
