const userService = require('../services/user.service');

exports.getAllUsers = async (req, res, next) => {
	try {
		let query = req.query;
		const users = await userService.getAllUsers(query);
		res.status(200).json({
			status: 'success',
			users: users,
		});
	} catch (error) {
		next(error);
	}
};

exports.setManager = async (req, res, next) => {
	try {
		const idUser = req.params.id;
		const user = await userService.updateInfo(idUser, { role: 'Manager' });
		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
};


exports.setVisiter = async (req, res, next) => {
	try {
		const idUser = req.params.id;
		const user = await userService.updateInfo(idUser, { role: 'Visiter' });
		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
};
