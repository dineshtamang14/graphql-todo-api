const bcrypt = require("bcryptjs"); 
const User = require("../database/models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    Query: {
        users: async () => {
            try {
                const users = await User.find();
                if(users) return users;
                throw new Error("Database is empty");
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
        user: async (_, {id}) => {
            try {
                const user = await User.findById({_id: id});
                if(user) return user;
                throw new Error(`user doesn't exists with id:${id}`)
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    },

    Mutation: {
        // signup reslover for user
        signup: async (_, {input}) => {
            try {
               const user = await User.findOne({email: input.email});
               if(user){
                throw new Error(`user already exists with email ${user.email}`);
               }
               const hashedPassword = await bcrypt.hash(input.password, 12);
               const newUser = new User({...input, password: hashedPassword});
               const result = await newUser.save();
               return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        },

        // login resolver for user
        login: async (_, {input}) => {
            try {
                const user = await User.findOne({email: input.email});
                if(!user) throw new Error(`user not found with email ${input.email}`);

                const isPasswordValid = await bcrypt.compare(input.password, user.password);
                if(!isPasswordValid){
                    throw new Error("incorrect password");
                }
                const secret = process.env.JWT_SECRET_KEY || "mysecretkey";
                const token = jwt.sign({email: user.email}, secret, { expiresIn: '1d'});
                return { token };
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