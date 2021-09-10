const express = require('express');
const AppError = require('../utils/AppError');
const authRoute = require('./auth.route');
const route = express.Router();
//Route import
const userRoute = require('./user.route');

//User route
route.use('/user', userRoute);
route.use('/auth', authRoute);
route.use('*', (req, res, next) => {
	next(new AppError('This route is not exist', 404));
});

module.exports = route;
