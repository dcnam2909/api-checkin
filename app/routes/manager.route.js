const express = require('express');
const checkOwner = require('../middlewares/checkOwner');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const managerRoute = express.Router();
const eventController = require('../controllers/event.controller');

managerRoute.use(verifyToken);

managerRoute.put(
	'/:idEvent/setAgent/:idUser',
	checkRoles('manager'),
	checkOwner,
	eventController.setAgent,
);

managerRoute.patch('/event/:idEvent', checkRoles('manager'), checkOwner, eventController.update);

managerRoute.get('/event', checkRoles('manager', 'agent'), eventController.getOwnerEvent);

managerRoute.post('/event', checkRoles('manager'), eventController.create); 

module.exports = managerRoute;
