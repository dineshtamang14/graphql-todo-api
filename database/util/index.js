const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

module.exports.connection = async () => {
    try {
        // to log all the querys hit by the mongoose
        // mongoose.set('debug', true);
        await mongoose.connect("mongodb+srv://dinesh:dinesh1997@cluster0.cuuqa.mongodb.net/Todo-DB?retryWrites=true&w=majority" || process.env.MONGODB_PROD_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });   
        console.log("DB connected..");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}