const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
	try {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1];
		}
        //Check log in
		if (!token) throw new AppError('Please log in!', 401);
		const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        //Check expire token
		if (Date.now() > tokenDecode.exp*1000)
			throw new AppError('Token is expire, please log in again!', 401);

        //Send tokenDecode
        req.body.tokenDecode = tokenDecode;
		next();
	} catch (error) {
		next(error);
	}
};
