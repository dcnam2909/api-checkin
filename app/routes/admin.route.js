const express = require('express');
const adminRoute = express.Router();
const adminController = require('../controllers/admin.controller');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');

adminRoute.use(verifyToken);

adminRoute.get('/visiters', checkRoles('Admin', 'Manager'), adminController.getAllVisiters);
adminRoute.get('/users', checkRoles('Admin', 'Manager'), adminController.getAllUsers);
adminRoute.get('/agents', checkRoles('Admin', 'Manager'), adminController.getAllAgents);

adminRoute.put('/setManager/:id', checkRoles('Admin'), adminController.setManager);
adminRoute.put('/setAgent/:id', checkRoles('Admin', 'Manager'), adminController.setAgent);

adminRoute.put('/setVisiter/:id', checkRoles('Admin','Manager'), adminController.setVisiter);

module.exports = adminRoute;
