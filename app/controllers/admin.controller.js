const userService = require('../services/user.service');

exports.getAllVisiters = async (req, res, next) => {
	try {
		const users = await userService.getAllVisiters();
		res.status(200).json({
			status: 'success',
			users: users,
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await userService.getAllUsers();
		res.status(200).json({
			status: 'success',
			users: users,
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllAgents = async (req, res, next) => {
	try {
		const users = await userService.getAllAgents();
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

exports.setAgent = async (req, res, next) => {
	try {
		const idUser = req.params.id;
		const user = await userService.updateInfo(idUser, { role: 'Agent' });
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
exports.deleteAccount = async (req, res, next) => {
	try {
		const idUser = req.params.id;
		const user = await userService.deleteAccount(idUser);
		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
};
