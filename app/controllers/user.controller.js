const userService = require('../services/user.service');
const eventService = require('../services/event.service');
const AppError = require('../config/AppError');

exports.getInfo = async (req, res, next) => {
	try {
		let user = req.body.user;
		user.passwordChangeAt = undefined;
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
		const dataUpdate = {
			fullName: req.body.fullName,
			address: req.body.address,
			phone: req.body.phone,
			workUnit: req.body.workUnit,
			addressUnit: req.body.addressUnit,
			idCB: req.body.idCB,
			idSV: req.body.idSV,
		};
		console.log(req.body);
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

exports.checkIn = async (req, res, next) => {
	try {
		const { imei, timeCheckin, code, user } = req.body;
		const idEvent = await eventService.decode(code);
		if (!idEvent) throw new AppError('Your key is expired, please try again!', 401);
		const event = await eventService.checkIn(idEvent, imei, timeCheckin, user._id);
		if (!event) throw new AppError('Check-in fail!', 400);
		res.status(200).json({
			status: 'success',
			message: 'Check-in successfully!',
		});
	} catch (error) {
		next(error);
	}
};
