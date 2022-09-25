const { ApolloServer } = require('apollo-server');
const Dataloader = require("dataloader");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const {connection} = require("./database/util");
const { verifyUser } = require("./helper/context");
const loaders = require("./loaders");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        await verifyUser(req);
        return {
            email: req.email,
            loggedInUserId: req.loggedInUserId,
            loaders: {
                user: new Dataloader(keys => loaders.user.batchUsers(keys))
            }
        }
    }
})

// db connectivity
connection();

server.listen({port: 4000}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });