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
    context: async ({ req, connection }) => {
        const contextObj = {};
        if(req){
            await verifyUser(req);
            contextObj.email = req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
        }
        contextObj.loaders = {
            user: new Dataloader(keys => loaders.user.batchUsers(keys))
        };
        return contextObj;
    },
    formatError: (error) => {
        // console.error(error);
        return {
            message: error.message
        }
    }
})

// db connectivity
connection();

server.listen({port: 4000}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

// app.installSubscriptionHandlers(httpServer);