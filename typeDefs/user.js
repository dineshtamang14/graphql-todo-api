const { gql } = require("apollo-server");

module.exports = gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User
    } 

    input userSignUpInput {
        name: String!
        email: String!
    }

    extend type Mutation {
        userSignUp(input: userSignUpInput!): User 
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }
`;