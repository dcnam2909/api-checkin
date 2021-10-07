const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

userRoute.use(verifyToken);

userRoute.get('/', userController.getInfo);

userRoute.post('/checkin', checkRoles('visiter'), userController.checkIn);

userRoute.patch('/update', userController.updateInfo);

userRoute.patch('/changePassword', userController.changePassword);

module.exports = userRoute;
