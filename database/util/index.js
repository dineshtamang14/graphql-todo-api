const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

module.exports.connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });   
        console.log("DB connected..")
    } catch (err) {
        console.error(err);
        throw err;
    }
}