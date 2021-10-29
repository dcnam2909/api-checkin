const eventService = require('../services/event.service');
const userService = require('../services/user.service');

const AppError = require('../config/AppError');
const { genQRCode } = require('../config/genQRCode');
exports.getAll = async (req, res, next) => {
	try {
		const query = req.query;
		const event = await eventService.getAll(query);
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
		await userService.updateInfo(idUser, { role: 'Agent' });
		const event = await eventService.addOwner(idUser, idEvent);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.generateCode = async (req, res, next) => {
	try {
		const expireQuery = req.query.expire * 1;
		const expire = Date.now() + expireQuery * 1000 * 60 || Date.now() + 10 * 1000 * 60;
		const idEvent = req.params.idEvent;
		const event = await eventService.getOne(idEvent);
		if (new Date(Date.now()).toDateString() < new Date(event.dateEvent).toDateString())
			throw new AppError('This event is not begin', 400);
		const key = await eventService.generateKey(event._id, expire);
		res.status(200).json({
			status: 'success',
			key,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.generateQRCode = async (req, res, next) => {
	try {
		const expireQuery = req.query.expire * 1;
		const expire = Date.now() + expireQuery * 1000 * 60 || Date.now() + 10 * 1000 * 60;
		const idEvent = req.params.idEvent;
		const event = await eventService.getOne(idEvent);
		if (Date.now() < event.dateEvent.getTime())
			throw new AppError('This event is not begin', 400);
		const key = await eventService.generateKey(event._id, expire);
		const nameQR = idEvent + expire;
		//gen QR Code
		const qrcode = await genQRCode(key, nameQR);
		const pathQR = `images/${nameQR}.png`;
		res.status(200).json({
			status: 'success',
			qrcode,
		});
	} catch (error) {
		next(error);
	}
};

exports.decodeCode = async (req, res, next) => {
	try {
		const code = req.body.code;
		const idEvent = await eventService.decode(code);
		if (!idEvent) throw new AppError('Your key is expired, please try again!', 400);
		const event = await eventService.getOne(idEvent);
		if (event.typeEvent !== 'public' && !event.listVisiters.includes(req.body.user._id))
			throw new AppError('You can not access this event!', 401);
		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (error) {
		next(error);
	}
};

exports.regsiterEvent = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const idUser = req.body.user._id;
		const event = await eventService.registerToEvent(idEvent, idUser);
		if (!event) throw new AppError('Can not register to this event', 400);
		res.status(200).json({
			status: 'success',
			event,
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
