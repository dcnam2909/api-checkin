const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

userRoute.get('/', verifyToken, userController.getInfo);
userRoute.patch('/update', verifyToken, userController.updateInfo);
userRoute.patch('/changePassword', verifyToken, userController.changePassword);

module.exports = userRoute;
