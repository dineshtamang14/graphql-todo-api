const bcrypt = require("bcryptjs"); 
const { combineResolvers } = require("graphql-resolvers")

const User = require("../database/models/user");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("./middleware");
const Task = require("../database/models/task");
const PubSub = require("apollo-server");
const {userEvents} = require("../subscription/events")

module.exports = {
    Query: {
        user: combineResolvers(isAuthenticated, async (_, __, {email}) => {
            try {
                const user = await User.findOne({email});
                if(!user) throw new Error(`user doesn't exists with id:${email}`);
                return user;
            } catch (err) {
                console.error(err);
                throw err;
            }
        })
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
               PubSub.publish(userEvents.USER_CREATED, {
                userCreated: result
               });
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
                if(!user) throw new Error("user not found");

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

    Subscription: {
        userCreated: {
            subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
        }
    },

    User: {
        tasks: async ({id}) => {
            try {
                const tasks = await Task.find({ user: id });
                return tasks;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    }
}