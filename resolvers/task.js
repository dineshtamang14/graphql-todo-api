
module.exports = {
    Query: {
        tasks: () => tasks,
        task: (_, { id } ) => tasks.find(task => task.id === id),
    },

    Mutation: {
        createTask: (_, {input}) => {
            const task = {...input, id: uuid.v4()};
            tasks.push(task);
            return task;
        }
    },

    // field level resolvers
    Task: {
        user: ({ userId }) => users.find(user => user.id == userId),
    },
}