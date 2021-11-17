const express = require('express');
const eventRoute = express.Router();

const checkRoles = require('../middlewares/checkRoles');
const verifyToken = require('../middlewares/verifyToken');
const eventController = require('../controllers/event.controller');
const checkOwner = require('../middlewares/checkOwner');

eventRoute.use(verifyToken);

eventRoute.post('/decode', eventController.decodeCode); // One
eventRoute.get('/:idEvent/registerToEvent', eventController.regsiterToEvent);
eventRoute.get('/:idEvent/removeToEvent', eventController.removeToEvent);
eventRoute.get(
	'/:idEvent/code',
	checkRoles('Manager', 'Agent'),
	checkOwner,
	eventController.generateCode,
);
eventRoute.get(
	'/:idEvent/qrcode',
	checkRoles('Manager', 'Agent'),
	checkOwner,
	eventController.generateQRCode,
);
eventRoute.get('/', eventController.getAll); // All

eventRoute.get('/:idEvent/report', checkRoles('Manager'), eventController.getReport);
eventRoute.get('/:idEvent/reportFile', checkRoles('Manager'), eventController.getReportFile);

module.exports = eventRoute;
