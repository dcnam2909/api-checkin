const express = require('express');
const eventRoute = express.Router();

const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const eventController = require('../controllers/event.controller');
const checkOwner = require('../middlewares/checkOwner');

eventRoute.use(verifyToken);

eventRoute.post('/decode', eventController.decodeCode); // One
eventRoute.post('/:idEvent/register', checkRoles('visiter'), eventController.regsiterEvent);
eventRoute.get(
	'/:idEvent/code',
	checkRoles('manager', 'agent'),
	checkOwner,
	eventController.generateCode,
); // expire=
eventRoute.get(
	'/:idEvent/qrcode',
	checkRoles('manager', 'agent'),
	checkOwner,
	eventController.generateQRCode,
); // expire= amount=
eventRoute.get('/', checkRoles('visiter'), eventController.getAll); // All
module.exports = eventRoute;
