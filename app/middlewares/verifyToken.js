const jwt = require('jsonwebtoken');
const AppError = require('../config/AppError');
const userService = require('../services/user.service');

module.exports = async (req, res, next) => {
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

        //Send tokenDecode
        const user = await userService.checkPassChanged(tokenDecode);
		console.log(user);
		if (!user)
			throw new AppError('Your password has been changed. Please, login again',401)
		req.body.user = user;
		next()
	} catch (error) {
		console.log(error)
		next(error);
	}
};
