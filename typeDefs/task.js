const { gql } = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        tasks(cursor: String, limit: Int): TaskFeed!
        task(id: ID!): Task 
    } 

    type TaskFeed {
        taskFeed: [Task!]
        pageInfo: PageInfo!
    }

    type PageInfo {
        nextPageCursor: String
        hasNextPage: Boolean
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