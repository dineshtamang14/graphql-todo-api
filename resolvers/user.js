const bcrypt = require("bcryptjs"); 
const { tasks } = require("../constants");
const User = require("../database/models/user");

module.exports = {
    Query: {
        users: () => users,
        user: (_, {id}) => users.find(user => user.id === id)
    },

    Mutation: {
        signup: async (_, {input}) => {
            try {
               const user = await User.findOne({email: input.email});
               if(user){
                throw new Error("user already exists..");
               }
               const hashedPassword = await bcrypt.hash(input.password, 12);
               const newUser = new User({...input, password: hashedPassword});
               const result = await newUser.save();
               return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    },

    User: {
        tasks: ({id}) => tasks.filter(task => task.userId === id) 
    }
}