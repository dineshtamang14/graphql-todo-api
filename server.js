const { ApolloServer, gql } = require('apollo-server');
const { users, tasks} = require("./constants/index");

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
    } 

    type User {
        id: ID!
        name: String!
        email: String
        tasks: [Task!]
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`;

const resolvers = {
    Query: {
        greetings: () => ["hello", "world"],
        tasks: () => tasks
    },

    // field level resolvers
    Task: {
        user: ({ userId }) => users.find(user => user.id == userId)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });