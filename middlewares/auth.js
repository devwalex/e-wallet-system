const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const jwtConfig = require("../config/jwt");

const auth = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token) {
          return res.status(httpStatus.UNAUTHORIZED).send({
            message: "This resources requires authorization",
          });
        }
        const decodeToken = await jwt.verify(token.split(' ')[1], jwtConfig.appKey)
        console.log("decodeToken", decodeToken);
        req.user = decodeToken
        next();
    } catch (error) {
        console.error("Auth Middleware Error ==>", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    }

};

module.exports = {
    auth
}