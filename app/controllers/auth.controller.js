const AppError = require('../config/AppError');
const userService = require('../services/auth.service');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signin = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) throw new AppError('Please enter your username and password!', 400);
		const user = await userService.checkUser(username, password);
		if (!user) throw new AppError('Username or password incorrect, please try again!', 401);
		const token = createToken(user.id);
		res.json({
			status: 'success',
			token,
			message: { role: user.role },
		});
	} catch (error) {
		next(error);
	}
};

exports.signup = async (req, res, next) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
			fullName: req.body.fullName,
			email: req.body.email,
			address: req.body.address,
			phone: req.body.phone,
			workUnit: req.body.workUnit,
			addressUnit: req.body.addressUnit,
			idCB: req.body.idCB,
			idSV: req.body.idSV,
		};
		const user = await userService.createUser(data);
		const token = createToken(user._id);
		res.status(200).json({
			status: 'success',
			token,
			message: 'Create user successfully.',
		});
	} catch (error) {
		next(error);
	}
};


