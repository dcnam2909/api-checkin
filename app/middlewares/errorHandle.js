const AppError = require('../utils/AppError');

const sendError = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		code: error.statusCode,
		message: error.message,
		trace: error.stack,
	});
};

const duplicateHandle = (error) => {
	const key = Object.keys(error.keyValue)[0];
	message = `Duplicate fields: ${key}, please try again!`;
	statusCode = 400;
	return new AppError(message, statusCode);
};

const validationHandle = (error) => {
	key = Object.keys(error.errors);
	message = `Invalid input data: ${key}`;
	return new AppError(message, 400);
};

module.exports = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	error.message = error.message || 'Oops! Something went wrong';
	
	if (error.code === 11000) error = duplicateHandle(error);
	if (error.name === 'ValidationError') error = validationHandle(error);
	sendError(error, res);
};
