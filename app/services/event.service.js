const Event = require('../models/Event');
const crypto = require('crypto-js');

exports.getAll = async () => {
	return await Event.find({ typeEvent: { $eq: 'restricted' } })
		.select('-owner -listVisiters')
		.sort({ dateEvent: 'asc' });
};

exports.getOwnerEvent = async (id) => {
	return await Event.find({ owner: { $eq: id } }).sort({ dateEvent: -1 });
};

exports.createNew = async (newEvent) => {
	return await Event.create(newEvent);
};

exports.getOne = async (id) => {
	return await Event.findById(id);
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

exports.addOwner = async (idUser, idEvent) => {
	const event = await Event.findById(idEvent);
	event.owner.push(idUser);
	event.save();
	return event;
};

exports.generateKey = async (idEvent, expire) => {
	const event = await Event.findById(idEvent);
	return crypto.Rabbit.encrypt(
		JSON.stringify({ id: event._id, expire }),
		process.env.SECRET_KEY_EVENT,
	).toString();
};

exports.decode = async (code) => {
	const decode = JSON.parse(
		crypto.Rabbit.decrypt(code, process.env.SECRET_KEY_EVENT).toString(crypto.enc.Utf8),
	);
	if (decode.expire > Date.now()) return decode.id;
};

exports.registerToEvent = async (idEvent, idUser) => {
	const event = await Event.findById(idEvent);
	if (
		event.typeEvent === 'restricted' &&
		new Date(event.openReg).getTime() < Date.now() &&
		new Date(event.endReg).getTime() > Date.now() &&
		!event.listVisiters.includes(idUser)
	) {
		event.listVisiters.push(idUser);
		event.save();
		return event;
	}
};

exports.checkIn = async (idEvent, macID, timeCheckin, idUser) => {
	let event = await Event.findById(idEvent);
	if (
		timeCheckin.getTime() < event.dateEvent.getTime() ||
		(event.typeEvent !== 'public' && !event.listVisiters.includes(idUser)) ||
		event.listVisitersCheckin.some((el) => el.visiter.equals(idUser))
	)
		return null;
	event.listVisitersCheckin.push({ visiter: idUser, macID, timeCheckin });
	event.save();
	return event;
};

exports.deleteEvent = async (idEvent) => {
	return await Event.deleteOne({ _id: idEvent });
};
