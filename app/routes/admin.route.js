const express = require('express');
const adminRoute = express.Router();
const adminController = require('../controllers/admin.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

adminRoute.use(verifyToken);

adminRoute.get('/users', checkRoles('Admin', 'Manager'), adminController.getAllVisiters);

adminRoute.put('/setManager/:id', checkRoles('Admin'), adminController.setManager);

adminRoute.put('/setVisiter/:id', checkRoles('Admin'), adminController.setVisiter);

module.exports = adminRoute;
