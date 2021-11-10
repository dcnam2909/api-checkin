const Event = require('../models/Event');
const crypto = require('crypto-js');
const { isValidObjectId } = require('mongoose');

exports.getAll = async () => {
	return await Event.find({ typeEvent: { $ne: 'private' } })
		.select('-owner')
		.sort({ dateEvent: -1 });
};

exports.getOwnerEvent = async (id) => {
	return await Event.find({ owner: { $eq: id } }).sort({
		dateEvent: -1,
	});
};

exports.createNew = async (newEvent) => {
	return await Event.create(newEvent);
};

exports.getOne = async (id) => {
	return await Event.findById(id).select('-listVisitersCheckin -owner');
};

exports.update = async (id, dataUpdate) => {
	return await Event.findByIdAndUpdate(id, dataUpdate, { runValidators: true, new: true }).select(
		'-listVisitersCheckin',
	);
};

exports.eventOwner = async (eventId, managerId) => {
	const event = await Event.findById(eventId);
	return await event.checkOwner(managerId);
};

exports.setAgent = async (idUser, idEvent) => {
	const event = await Event.findById(idEvent);
	if (event.owner.find((el) => el.equals(idUser))) return event;
	event.owner.push(idUser);
	await event.save();
	return event;
};

exports.removeAgent = async (idUser, idEvent) => {
	const event = await Event.findById(idEvent);
	const index = event.owner.findIndex((el) => el.equals(idUser));
	if (index === -1) return { event: null, message: 'You are not Agent of this event', code: 400 };
	event.owner.splice(index, 1);
	await event.save();
	return { event };
};

exports.generateKey = async (idEvent, expire) => {
	const event = await Event.findById(idEvent);
	return crypto.AES.encrypt(
		JSON.stringify({ id: event._id, expire }),
		process.env.SECRET_KEY_EVENT,
	).toString();
};

exports.decode = async (code) => {
	const decode = JSON.parse(
		crypto.AES.decrypt(code, process.env.SECRET_KEY_EVENT).toString(crypto.enc.Utf8),
	);
	if (decode.expire > Date.now()) return decode.id;
};

exports.registerToEvent = async (idEvent, idUser) => {
	const event = await Event.findById(idEvent);
	if (
		event.typeEvent === 'restricted' &&
		new Date(event.openReg).getTime() < Date.now() &&
		new Date(event.endReg).getTime() > Date.now() &&
		event.listVisitersCheckin.find((el) => el.visiter.equals(idUser)) === undefined
	) {
		event.listVisitersCheckin.push({ visiter: idUser });
		await event.save();
		return event;
	}
};

exports.checkIn = async (idEvent, imei, timeCheckin, idUser) => {
	let event = await Event.findById(idEvent);
	const userInEvent = event.listVisitersCheckin.find((el) => el.visiter.equals(idUser));
	if (event.typeEvent !== 'public' && !userInEvent) {
		return {
			event: null,
			message: 'You are not invited to this event',
			code: 401,
		};
	}
	if (userInEvent && userInEvent.isCheckin === true) {
		return {
			event: null,
			message: 'You already check in to this event',
			code: 400,
		};
	}
	if (event.typeEvent !== 'public' && userInEvent) {
		let needCheckin = event.listVisitersCheckin.findIndex((el) => el.visiter.equals(idUser));
		event.listVisitersCheckin[needCheckin] = Object.assign(
			event.listVisitersCheckin[needCheckin],
			{
				isCheckin: true,
				imei,
				timeCheckin,
			},
		);
		await event.save();
		return { event };
	}
	if (event.typeEvent === 'public' && !userInEvent) {
		event.listVisitersCheckin.push({
			visiter: idUser,
			imei,
			timeCheckin,
			isCheckin: true,
		});
		await event.save();
		return { event };
	}
};

exports.deleteEvent = async (idEvent) => {
	return await Event.deleteOne({ _id: idEvent });
};

exports.getReport = async (idEvent) => {
	const event = await Event.findById(idEvent).populate('listVisitersCheckin.visiter');
	let regVisiterCount = 0;
	let checkinVisiterCount = 0;
	event.listVisitersCheckin.forEach((el) => {
		if (el.isCheckin === true) checkinVisiterCount++;
		regVisiterCount++;
	});
	return {
		name: event.name,
		regVisiterCount,
		checkinVisiterCount,
		listCheckin: event.listVisitersCheckin,
	};
};

exports.addVisiters = async (idEvent, listVisiters) => {
	const event = await Event.findById(idEvent).populate('listVisitersCheckin.visiter').exec();
	if (event.typeEvent === 'public')
		return { event: null, message: 'You can not add visiter to this event', code: 400 };
	event.listVisitersCheckin = [];
	listVisiters.forEach((visiter) => {
		event.listVisitersCheckin.push({ visiter });
	});
	await event.save();
	return { event };
};
