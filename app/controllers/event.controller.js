const eventService = require('../services/event.service');
const userService = require('../services/user.service');

const AppError = require('../config/AppError');
const { genQRCode } = require('../config/genQRCode');
exports.getAll = async (req, res, next) => {
	try {
		const event = await eventService.getAll();
		res.status(200).json({
			status: 'success',
			result: event.length,
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.getOwnerEvent = async (req, res, next) => {
	try {
		const idManager = req.body.user._id;
		const event = await eventService.getOwnerEvent(idManager);
		res.status(200).json({
			status: 'success',
			result: event.length,
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.getOne = async (req, res, next) => {
	try {
		let id = req.params.code;
		const event = await eventService.getOne(id);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};
exports.create = async (req, res, next) => {
	try {
		const newEvent = {
			name: req.body.name,
			location: req.body.location,
			typeEvent: req.body.typeEvent,
			dateEvent: req.body.dateEvent,
			openReg: req.body.openReg,
			endReg: req.body.endReg,
			owner: req.body.user._id,
		};
		const event = await eventService.createNew(newEvent);
		event.id = undefined;
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};
exports.update = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const dataEvent = {
			name: req.body.name,
			location: req.body.location,
			typeEvent: req.body.typeEvent,
			dateEvent: req.body.dateEvent,
			openReg: req.body.openReg,
			endReg: req.body.endReg,
		};
		const event = await eventService.update(idEvent, dataEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.setAgent = async (req, res, next) => {
	try {
		const idUser = req.params.idUser;
		const idEvent = req.params.idEvent;
		const agent = await userService.getOneVisiter(idUser);
		if (agent.role !== 'Agent') throw new AppError('This user is not agent!', 401);
		const event = await eventService.setAgent(idUser, idEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};
exports.removeAgent = async (req, res, next) => {
	try {
		const idUser = req.params.idUser;
		const idEvent = req.params.idEvent;
		const result = await eventService.removeAgent(idUser, idEvent);
		if (!result.event) throw new AppError(result.message, result.code);
		res.status(200).json({
			status: 'success',
			event: result.event,
		});
	} catch (error) {
		next(error);
	}
};

exports.generateCode = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const event = await eventService.getOne(idEvent);
		if (
			new Date(Date.now()).setHours(24, 0, 0, 0) <
			new Date(event.dateEvent).setHours(24, 0, 0, 0)
		)
			throw new AppError('This event is not begin', 400);
		const key = event.id;
		res.status(200).json({
			status: 'success',
			message: {
				key,
			},
		});
	} catch (error) {
		next(error);
	}
};

exports.generateQRCode = async (req, res, next) => {
	try {
		const expireQuery = req.query.expire * 1;
		const expire = Date.now() + expireQuery * 1000 * 60 || Date.now() + 10 * 1000 * 60;
		const idEvent = req.params.idEvent;
		const event = await eventService.getOne(idEvent);
		if (
			new Date(Date.now()).setHours(24, 0, 0, 0) <
			new Date(event.dateEvent).setHours(24, 0, 0, 0)
		)
			throw new AppError('This event is not begin', 400);
		const key = await eventService.generateKey(event.id, expire);
		//gen QR Code
		const qrcode = await genQRCode(key);
		res.status(200).json({
			status: 'success',
			message: {
				qrcode,
				expireIn: expire,
			},
		});
	} catch (error) {
		next(error);
	}
};
exports.decodeCode = async (req, res, next) => {
	try {
		const code = req.body.code;
		let idEvent = code;
		if (code.length > 6) {
			idEvent = await eventService.decodeQRCode(code);
			if (!idEvent) throw new AppError('Your key is expired, please try again!', 400);
		}
		const event = await eventService.getOneByDecode(idEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.regsiterToEvent = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const idUser = req.body.user._id;
		const result = await eventService.registerToEvent(idEvent, idUser);
		if (!result.event) throw new AppError(result.message, result.code);
		res.status(200).json({
			status: 'success',
			event: result.event,
		});
	} catch (error) {
		next(error);
	}
};
exports.removeToEvent = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const idUser = req.body.user._id;
		const result = await eventService.removeToEvent(idEvent, idUser);
		if (!result.event) throw new AppError(result.message, result.code);
		res.status(200).json({
			status: 'success',
			event: result.event,
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteEvent = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const event = await eventService.deleteEvent(idEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.getReport = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const result = await eventService.getReport(idEvent);
		res.status(200).json({
			status: ' success',
			result,
		});
	} catch (error) {
		next(error);
	}
};

exports.addVisiters = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const listVisiter = req.body.listVisiter;
		const result = await eventService.addVisiters(idEvent, listVisiter);
		if (!result.event) throw new AppError(result.message, result.code);
		res.status(200).json({
			status: 'success',
			event: result.event,
		});
	} catch (error) {
		next(error);
	}
};
