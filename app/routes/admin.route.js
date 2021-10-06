const express = require('express');
const adminRoute = express.Router();
const adminController = require('../controllers/admin.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

adminRoute.use(verifyToken);

adminRoute.get('/users', checkRoles('admin','manager'), adminController.getAllUsers);
adminRoute.put('/setManager/:id', checkRoles('admin'), adminController.setManager);
adminRoute.put('/setVisiter/:id', checkRoles('admin', 'manager'), adminController.setVisiter);

module.exports = adminRoute;
