const { gql } = require("apollo-server");

module.exports = gql`
    extend type Query {
        tasks: [Task!]
        task(id: ID!): Task 
    } 

    input createtaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    extend type Mutation {
        createTask(input: createtaskInput!): Task
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`;