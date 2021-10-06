const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const managerRoute = express.Router();


managerRoute.use(verifyToken);

// managerRoute.patch('/:id', checkRoles('manager'), checkOwner, eventController.update);
// managerRoute.put('/:idEvent/setAgent/:idUser', eventController.setAgent);
// managerRoute.post('/event', checkRoles('manager'), eventController.create); //create

module.exports = managerRoute;
        