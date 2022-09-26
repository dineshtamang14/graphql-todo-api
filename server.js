const express = require("express"); 
const cors = require("cors");
const { ApolloServer } = require('apollo-server-express');
const Dataloader = require("dataloader");
const morgan = require("morgan");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const {connection} = require("./database/util");
const { verifyUser } = require("./helper/context");
const loaders = require("./loaders");


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const apolloServer = new ApolloServer({
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
});

// db connectivity
connection();

app.get("/", (req, res) => {
    res.status(200).send({
        name: "Dinesh Tamang",
        profile: "https://dineshtamang.tech",
        portfolio: "https://portfolio.dineshtamang.tech",
        github: "https://github.com/dineshtamang14",
        projects: [
            "Netfilx Clone",
            "Facebook clone",
            "Whats App Clone",
            "Graphql API",
            "Rest API",
            "Amazon clone",
            "Tinder Clone"
        ]
    });
})

const PORT = process.env.PORT || 4000;

apolloServer.start().then(res => {
    apolloServer.applyMiddleware({ 
        app, 
        path: '/graphql' 
    }); 

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at localhost:4000${apolloServer.graphqlPath}`);
      });
})

// apolloServer.installSubscriptionHandlers(httpServer);