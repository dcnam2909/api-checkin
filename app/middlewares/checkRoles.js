const AppError = require('../config/AppError');

module.exports = (...roles) => {
	return (req, res, next) => {
		//Check role can access role = []
		if (!roles.includes(req.body.user.role))
			next(new AppError('You can not access this route', 401));
		next();
	};
};
