const express = require('express');
const userController = require('../controllers/user.controller');
const { userValidation } = require('../validations');

const router = express.Router();

router.post('/register', userValidation.register,  userController.register);
router.post('/login',  userValidation.login,  userController.login);

module.exports = router;