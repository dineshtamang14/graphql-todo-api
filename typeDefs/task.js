const { gql } = require("apollo-server");

module.exports = gql`
    extend type Query {
        tasks(skip: Int, limit: Int): [Task!]
        task(id: ID!): Task 
    } 

    input createtaskInput {
        title: String!
        description: String!
        completed: Boolean!
    }

    extend type Mutation {
        createTask(input: createtaskInput!): Task
        updateTask(id: ID!, input: updateTaskInput!): Task
        deleteTask(id: ID!): Task
    }

    input updateTaskInput {
        title: String
        description: String
        completed: Boolean
    }

    type Task {
        id: ID!
        title: String!
        description: String!
        completed: Boolean!
        user: User!
        createdAt: Date!
        updatedAt: Date!
    }
`;