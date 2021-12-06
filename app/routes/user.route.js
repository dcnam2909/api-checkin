const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const groupController = require('../controllers/group.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const upload = multer();

userRoute.use(verifyToken);

userRoute.get('/', userController.getInfo);
userRoute.get('/event', checkRoles('Visiter'), userController.getRegEvent);

userRoute.post('/checkin', checkRoles('Visiter'), userController.checkIn);

userRoute.patch('/update', userController.updateInfo);

userRoute.patch('/changePassword', userController.changePassword);

userRoute.get('/group', checkRoles('Manager'), groupController.getGroup);

userRoute.put('/group/:idGroup', checkRoles('Manager'), groupController.addToGroup);

userRoute.delete('/group/:idGroup', checkRoles('Manager'), groupController.deleteGroup);

userRoute.post(
	'/group/:idGroup/addByFile',
	checkRoles('Manager'),
	upload.single('file'),
	groupController.addByFile,
);

userRoute.post('/group', checkRoles('Manager'), groupController.createGroup);
module.exports = userRoute;
