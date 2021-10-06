const express = require('express');
const checkOwner = require('../middlewares/checkOwner');
const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const managerRoute = express.Router();
const eventController = require('../controllers/event.controller');

managerRoute.use(verifyToken);

managerRoute.patch('/event/:idEvent', checkRoles('manager'), checkOwner, eventController.update);

managerRoute.put(
	'/:idEvent/setAgent/:idUser',
	checkRoles('manager'),
	checkOwner,
	eventController.setAgent,
);

managerRoute.get('/event', checkRoles('manager', 'agent'), eventController.getOwnerEvent);

managerRoute.post('/event', checkRoles('manager'), checkOwner, eventController.create); //create

module.exports = managerRoute;

// 615db08eba34bc9eb212894e
// 615db576b4d298041f21a812
