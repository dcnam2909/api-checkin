const AppError = require('../utils/AppError');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signin = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		const user = await userService.login(username, password);

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
		//format birthday from DD-MM-YYYY to YYYY-MM-DD
		const birthday = req.body.birthday.split('-');
		const formatBirday = new Date(`${birthday[2]}-${birthday[1]}-${birthday[0]}`)
		const data = {
			username: req.body.username,
			password: req.body.password,
			lastName: req.body.lastName,
			firstName: req.body.firstName,
			email: req.body.email,
			birthday: formatBirday,
			address: {
				city: req.body.city,
				address: req.body.address,
			},
			role: 'user',
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

exports.signupManager = async (req, res, next) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
			lastName: req.body.lastName,
			firstName: req.body.firstName,
			email: req.body.email,
			company: req.body.company,
			role: 'manager',
		};
		const manager = await userService.createUser(data);
		const token = createToken(manager.__id);
		res.status(200).json({
			status: 'success',
			token,
			message: 'Create manager successfully.',
		});
	} catch (error) {
		next(error);
	}
};
