const express = require("express");
const userController = require("../controllers/user.controller");
const { userValidation } = require("../validations");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", userValidation.register, userController.register);
router.post("/login", userValidation.login, userController.login);
router.get("/auth/profile", [auth], userController.getProfile);

module.exports = router;
