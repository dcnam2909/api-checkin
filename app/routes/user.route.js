const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const groupController = require('../controllers/group.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

userRoute.use(verifyToken);

userRoute.get('/', userController.getInfo);

userRoute.post('/checkin', checkRoles('Visiter'), userController.checkIn);

userRoute.patch('/update', userController.updateInfo);

userRoute.patch('/changePassword', userController.changePassword);

userRoute.get('/group', checkRoles('Manager'), groupController.getGroup);

userRoute.post('/group', checkRoles('Manager'), groupController.createGroup);

userRoute.put('/group/:idGroup', checkRoles('Manager'), groupController.addToGroup);

userRoute.delete('/group/:idGroup', checkRoles('Manager'), groupController.deleteGroup);

module.exports = userRoute;
