const express = require('express');
const AppError = require('../config/AppError');
const authRoute = require('./auth.route');
const eventRoute = require('./event.route');
const adminRoute = require('./admin.route');
const managerRoute = require('./manager.route');
const route = express.Router();
//Route import
const userRoute = require('./user.route');

//User route
route.use('/auth', authRoute);
route.use('/user', userRoute);
route.use('/event', eventRoute);
route.use('/admin', adminRoute);
route.use('/manager', managerRoute);

//Throw 404 error if not exist route
route.use('*', (req, res, next) => {
	next(new AppError('This route is not exist', 404));
});

module.exports = route;
