const { ApolloServer } = require('apollo-server');
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const {connection} = require("./database/util");

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// db connectivity
connection();

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });