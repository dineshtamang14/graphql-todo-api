const jwt = require("jsonwebtoken");

module.exports.verifyUser = async (req) => {
    // console.log(req.headers.authorization);
    try {
        req.email = null;
        const bearerHeader = req.headers.authorization;
        if(bearerHeader){
            const token = bearerHeader.split(" ")[1];
            // console.log(token);
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "mysecretkey");
            req.email = payload.email;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}