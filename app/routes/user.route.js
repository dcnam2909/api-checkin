const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');

userRoute.get('/', verifyToken, userController.getInfo);
userRoute.get('/changePass', verifyToken, userController.changePassword);
// userRoute.patch('/', verifyToken, userController.update);

module.exports = userRoute;
