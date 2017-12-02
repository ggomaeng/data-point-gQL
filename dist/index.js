"use strict";

var _graphql = require("graphql");

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      hello: {
        type: _graphql.GraphQLString,
        resolve: function resolve() {
          return "world";
        }
      }
    }
  })
});
var query = "{ hello }";

(0, _graphql.graphql)(schema, query).then(function (result) {
  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);
});