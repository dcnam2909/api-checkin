class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode || 500;
		this.status = statusCode.toString().startsWith('4') ? 'error' : 'fail';
	}
}

module.exports = AppError;
