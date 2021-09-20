const userService = require('../services/user.service');
const AppError = require('../config/AppError');

exports.getInfo = async (req, res, next) => {
	try {
		let user = req.body.user;
		user.passwordChangeAt = undefined;
		user._id = undefined;
		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (error) {
		next(error);
	}
};

exports.changePassword = async (req, res, next) => {
	try {
		const user = req.body.user;
		const currentPassword = req.body.currentPassword;
		const newPassword = req.body.newPassword;
		//Check password changed
		const change = await userService.changePass(user.id, currentPassword, newPassword);
		if (!change)
			throw new AppError('Your current password is not match, please try again!', 401);
		res.status(200).json({
			status: 'success',
			message: 'Change password successfully! Please, login again',
		});
	} catch (error) {
		next(error);
	}
};

exports.updateInfo = async (req, res, next) => {
	try {
		let birthday = req.body.birthday;
		if (birthday) {
			birthday = birthday.split('-');
			birthday = new Date(`${birthday[2]}-${birthday[1]}-${birthday[0]}`);
		}
		let address = {
			city: req.body.city,
			address: req.body.address,
		};
		if (!req.body.city || !req.body.address) address = undefined;
		const dataUpdate = {
			address,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			birthday,
		};
		const user = await userService.updateInfo(req.body.user._id, dataUpdate);
		res.status(200).json({
			status: 'success',
			message: 'Update info success',
			user: user,
		});
	} catch (error) {
		next(error);
	}
};
