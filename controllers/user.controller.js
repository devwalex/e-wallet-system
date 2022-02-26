const { userService } = require("../services");
const httpStatus = require("http-status");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const user = await userService.createUser(req.body);
    return res.status(httpStatus.CREATED).send(user);
  } catch (error) {
    console.error("Register Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    const payload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    const token = jwt.sign(payload, jwtConfig.appKey, {
      expiresIn: "1h",
    });

    return res.status(httpStatus.OK).send({
      message: "Logged in successfully!",
      results: payload,
      token,
    });
  } catch (error) {
    console.error("Login Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

module.exports = {
  register,
  login,
};
