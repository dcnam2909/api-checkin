const AppError = require('../config/AppError');

const sendError = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		code: error.statusCode,
		message: error.message,
		// trace: error.stack,
	});
};

const duplicateHandle = (error) => {
	const key = Object.keys(error.keyValue)[0];
	let message = `Duplicate fields: ${key}, please try again!`;
	statusCode = 400;
	return new AppError(message, statusCode);
};

const validationHandle = (error) => {
	let key = Object.keys(error.errors);
	let message = error.errors[key].properties.message;
	return new AppError(message, 400);
};

const tokenExpiredHandle = (error) => {
	let message = `Token is expire, please log in again!`;
	return new AppError(message, 401);
};

const tokenUndefinedHandle = (error) => {
	let message = `Token is undefined, please log in again!`;
	return new AppError(message, 401);
}

module.exports = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	error.message = error.message || 'Oops! Something went wrong';

	if (error.code === 11000) error = duplicateHandle(error);
	if (error.name === 'ValidationError') error = validationHandle(error);
	if (error.name === 'TokenExpiredError') error = tokenExpiredHandle(error);
	if (error.name === 'JsonWebTokenError') error = tokenUndefinedHandle(error);
	sendError(error, res);
};
