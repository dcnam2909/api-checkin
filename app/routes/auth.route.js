const express = require('express');
const authRoute = express.Router();
const authController = require('../controllers/auth.controller');

authRoute.post('/signin',authController.signin);
authRoute.post('/signup', authController.signup);
authRoute.post('/signupManager', authController.signupManager);

module.exports = authRoute;
