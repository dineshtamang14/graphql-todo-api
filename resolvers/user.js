const {users, tasks } = require("../constants");
const uuid = require("uuid");

module.exports = {
    Query: {
        users: () => users,
        user: (_, {id}) => users.find(user => user.id === id)
    },

    Mutation: {
        userSignUp: (_, {input}) => {
            const user = {...input, id: uuid.v4()};
            users.push(user);
            return user;
        }
    },

    User: {
        tasks: ({id}) => tasks.filter(task => task.userId === id) 
    }
}