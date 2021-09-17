const userService = require('../services/user.service');
const AppError = require('../config/AppError');

exports.getInfo = async (req, res, next) => {
	try {
		const user = req.body.user;
		res.status(200).json({
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
		if (!change) throw new AppError('Your current password is not match, please try again!',401);
		console.log(change);
		res.status(200).json({
			status: 'success',
			message: 'Change password successfully! Please, login again',
		});
	} catch (error) {
		next(error);
	}
};
