const { userService, walletService } = require("../services");
const httpStatus = require("http-status");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const catchAsync = require("../utils/catchasync");
const UnAuthorizedError = require("../utils/errors/unauthorized.error");

const register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }
  const user = await userService.createUser(req.body);

  await walletService.createWallet(user[0]);

  return res.status(httpStatus.CREATED).send({
    success: true,
    message: "Registered successfully!",
  });
});

const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userService.findUserByEmail(email);

  if (!user) {
    throw new UnAuthorizedError("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new UnAuthorizedError("Invalid email or password");
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
    success: true,
    message: "Logged in successfully!",
    results: payload,
    token,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user);

  return res.status(httpStatus.OK).send({
    success: true,
    message: "Returned profile successfully",
    result: user,
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
