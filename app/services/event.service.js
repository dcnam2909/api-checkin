const Event = require('../models/Event');
const Group = require('../models/GroupVisiter');
const crypto = require('crypto-js');
const xlsx = require('node-xlsx');
const User = require('../models/User');

exports.getAll = async () => {
	return await Event.find({ typeEvent: { $ne: 'private' } })
		.select('-owner -id')
		.sort({ dateEvent: -1 });
};

exports.getOwnerEvent = async (id) => {
	return await Event.find({ owner: { $eq: id } })
		.populate('listVisitersCheckin.visiter')
		.sort({
			dateEvent: -1,
		})
		.select('-id');
};

exports.createNew = async (newEvent, repeatEvent) => {
	let date = newEvent.dateEvent;
	const array = new Array();
	if (repeatEvent === 0) return await Event.create(newEvent);
	if (repeatEvent === 1) {
		for (let i = 0; i <= 6; i++) {
			let newDate = new Date(date).setDate(new Date(date).getDate() + i);
			let addEvent = Object.assign(newEvent, { dateEvent: new Date(newDate) });
			array.push(Event.create(addEvent));
		}
		return Promise.all(array);
	}
	if (repeatEvent === 7) {
		for (let i = 0; i <= 7; i++) {
			let numbDays = i * repeatEvent;
			let newDate = new Date(date).setDate(new Date(date).getDate() + numbDays);
			let addEvent = Object.assign(newEvent, { dateEvent: new Date(newDate) });
			array.push(Event.create(addEvent));
		}
		return Promise.all(array);
	}
	if (repeatEvent === 30) {
		for (let i = 0; i <= 5; i++) {
			let newDate = new Date(date).setMonth(new Date(date).getMonth() + i);
			let addEvent = Object.assign(newEvent, { dateEvent: new Date(newDate) });
			array.push(Event.create(addEvent));
		}
		return Promise.all(array);
	}
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
	const event = await Event.findById(eventId).select('-id');
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
	return crypto.AES.encrypt(
		JSON.stringify({ id: idEvent, expire }),
		process.env.SECRET_KEY_EVENT,
	).toString();
};

exports.getCodeBluetooth = async (idEvent) => {
	const event = await Event.findById(idEvent);
	return event.id;
};

exports.decodeQRCode = async (code) => {
	const decode = JSON.parse(
		crypto.AES.decrypt(code, process.env.SECRET_KEY_EVENT).toString(crypto.enc.Utf8),
	);
	if (decode.expire > Date.now()) return decode.id;
};

exports.getOneByCode = async (id) => {
	return await Event.find({ id }).select('-listVisitersCheckin -owner -id');
};

exports.registerToEvent = async (idEvent, idUser) => {
	const event = await Event.findById(idEvent);
	if (new Date(event.openReg) > new Date())
		return {
			event: null,
			message: `This event has not opened register, try again in ${event.openReg}`,
			code: 400,
		};
	if (new Date(event.endReg) < new Date())
		return {
			event: null,
			message: `This event was end regsiter`,
			code: 400,
		};
	if (event.listVisitersCheckin.find((el) => el.visiter.equals(idUser)) !== undefined)
		return {
			event: null,
			message: `You already registered to this event`,
			code: 400,
		};
	event.listVisitersCheckin.push({ visiter: idUser });
	await event.save();
	return { event };
};

exports.removeToEvent = async (idEvent, idUser) => {
	const event = await Event.findById(idEvent);
	const index = event.listVisitersCheckin.findIndex((el) => el.visiter.equals(idUser));
	if (index === -1 || event.listVisitersCheckin[index].isCheckin === true)
		return { event: null, message: 'Something wrong!', code: 400 };
	event.listVisitersCheckin.splice(index, 1);
	await event.save();
	return { event };
};

exports.checkIn = async (idEvent, imei, timeCheckin, idUser) => {
	let event = await Event.findOne({ id: idEvent });
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

exports.addByGroup = async (idEvent, idGroup) => {
	const event = await Event.findById(idEvent).populate('listVisitersCheckin.visiter').exec();
	if (event.typeEvent === 'public')
		return { event: null, message: 'You can not add visiter to this event', code: 400 };
	const group = await Group.findById(idGroup);
	group.users.forEach((user) => {
		if (!event.listVisitersCheckin.find((el) => el.visiter.equals(user._id)))
			event.listVisitersCheckin.push({ visiter: user });
	});
	await event.save();
	return { event };
};

exports.getRegEvent = async (idUser) => {
	const event = await Event.find({
		listVisitersCheckin: { $elemMatch: { visiter: idUser } },
	}).select('-listVisitersCheckin -owner -id');
	return { event };
};

exports.getReportFile = async (idEvent) => {
	const event = await Event.findById(idEvent).populate('listVisitersCheckin.visiter');
	const dataCheckin = event.listVisitersCheckin.reduce((acc, cur) => {
		acc.push([
			cur.visiter.username,
			cur.isCheckin ? 'Đã check-in' : 'Chưa check-in',
			cur.timeCheckin
				? `${new Date(cur.timeCheckin).getDate()}/${new Date(
						cur.timeCheckin,
				  ).getMonth()}/${new Date(cur.timeCheckin).getFullYear()}`
				: 'Chưa check-in',
			cur.imei ? cur.imei : 'Chưa check-in',
			cur.visiter.fullName,
			cur.visiter.email,
			cur.visiter.phone,
			cur.visiter.address,
			cur.visiter.workUnit,
			cur.visiter.addressUnit,
			cur.visiter.idCB ? cur.visiter.idCB : '',
			cur.visiter.idSV ? cur.visiter.idSV : '',
		]);
		return acc;
	}, []);
	dataCheckin.unshift([
		'Username',
		'Đã check-in',
		'Thời gian check-in',
		'Thiết bị check-in',
		'Họ và tên',
		'Email',
		'Số điện thoại',
		'Địa chỉ',
		'Đơn vị công tác',
		'Địa chỉ đơn vị công tác',
		'Mã số cán bộ',
		'Mã số sinh viên',
	]);

	const buffer = xlsx.build([{ name: 'mySheetName', data: dataCheckin }]);
	return buffer;
};

exports.addByFile = async (idEvent, file) => {
	const event = await Event.findById(idEvent).populate('listVisitersCheckin.visiter').exec();
	const data = xlsx.parse(file.buffer);
	const columnUsername = data[0].data.shift().indexOf('Username');
	const dataUsername = data[0].data.map((el) => el[columnUsername]);
	const dataVisiter = await User.find({
		$and: [{ username: { $in: dataUsername } }, { role: 'Visiter' }],
	});
	dataVisiter.forEach((user) => {
		if (!event.listVisitersCheckin.find((el) => el.visiter.equals(user._id)))
			event.listVisitersCheckin.push({ visiter: user });
	});
	await event.save();
	return { event };
};

exports.getAllEventAdmin = async () => {
	const event = await Event.find().populate('owner').sort({ dateEvent: -1 });
	return event;
};
