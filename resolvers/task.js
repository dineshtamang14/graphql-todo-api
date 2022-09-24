const { combineResolvers } = require("graphql-resolvers")
const { isAuthenticated, isTaskOwner } = require("./middleware");
const Task = require("../database/models/task");
const User = require("../database/models/user");

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated, async (_, { skip=0, limit=10 }, { loggedInUserId }) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId }).sort({_id: -1}).skip(skip).limit(limit);
                return tasks;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            try {
                const task = await Task.findById(id);
                return task;
            } catch (err) {
                console.error(err);
                throw err;
            }
        })
    },

    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_, {input}, {email}) => {
            try {
                const user = await User.findOne({ email });
                const task = new Task({...input, user: user.id});
                const result = await task.save();
                user.tasks.push(result.id);
                await user.save();
                return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }),

        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async(_, { id, input }) => {
            try {
                const task = await Task.findByIdAndUpdate(id, {...input}, {new: true});
                return task;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }),

        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, {loggedInUserId}) => {
            try {
                const task = await Task.findByIdAndDelete(id);
                await User.updateOne({_id: loggedInUserId}, { $pull: { tasks: task.id } });
                return task;
            } catch (err) {
                console.error(err);
                throw err;
            }
        })
    },

    // field level resolvers
    Task: {
        user: async (parent) => {
            try {
                const user = await User.findById(parent.user);
                return user;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    },
}