const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

userRoute.get('/', verifyToken, userController.getInfo);
userRoute.put('/', verifyToken, userController.updateInfo);
userRoute.patch('/changePass', verifyToken, userController.changePassword);

module.exports = userRoute;
