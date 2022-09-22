const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        greetings: [String!]
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
        greetings: () => ["hello", "world"]
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });