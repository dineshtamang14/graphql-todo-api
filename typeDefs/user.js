const { gql } = require("apollo-server");

module.exports = gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User
    } 

    input signupInput {
        name: String!
        email: String!
        password: String!
    }

    extend type Mutation {
        signup(input: signupInput!): User 
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        tasks: [Task!]
        createdAt: String!
        updatedAt: String!
    }
`;