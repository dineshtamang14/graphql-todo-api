const { ApolloServer, gql } = require('apollo-server');
const { users, tasks} = require("./constants/index");
const uuid = require("uuid");

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
        task(id: ID!): Task 
        users: [User!]
        user(id: ID!): User
    } 

    input createtaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    input userSignUpInput {
        name: String!
        email: String!
    }

    type Mutation {
        createTask(input: createtaskInput!): Task
        userSignUp(input: userSignUpInput!): User 
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
        tasks: () => tasks,
        task: (_, {id} ) => tasks.find(task => task.id === id),
        users: () => users,
        user: (_, {id}) => users.find(user => user.id === id)
    },

    Mutation: {
        createTask: (_, {input}) => {
            const task = {...input, id: uuid.v4()};
            tasks.push(task);
            return task;
        },

        userSignUp: (_, {input}) => {
            const user = {...input, id: uuid.v4()};
            users.push(user);
            return user;
        }
    },

    // field level resolvers
    Task: {
        user: ({ userId }) => users.find(user => user.id == userId),
    },

    User: {
        tasks: ({ id }) => tasks.filter(task => task.userId === id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });