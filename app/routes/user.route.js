const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

userRoute.use(verifyToken);

userRoute.get('/', userController.getInfo);
userRoute.patch('/update', checkRoles('user'), userController.updateInfo);
userRoute.patch('/changePassword', userController.changePassword);

module.exports = userRoute;
