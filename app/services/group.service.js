const Group = require('../models/GroupVisiter');
const User = require('../models/User');
const xlsx = require('node-xlsx');

exports.getGroup = async () => {
	return Group.find();
};

exports.createGroup = async (data) => {
	return await Group.create(data);
};

exports.addToGroup = async (idGroup, listVisiter) => {
	const group = await Group.findById(idGroup);
	group.users = listVisiter;
	await group.save();
	return group;
};

exports.deleteGroup = async (id) => {
	return await Group.findByIdAndRemove(id);
};

exports.addByFile = async (idGroup, file) => {
	const group = await Group.findById(idGroup);
	const data = xlsx.parse(file.buffer);
	const columnUsername = data[0].data.shift().indexOf('Username');
	const dataUsername = data[0].data.map((el) => el[columnUsername]);
	const dataVisiter = await User.find({
		$and: [{ username: { $in: dataUsername } }, { role: 'Visiter' }],
	});
	console.log(dataVisiter);
	dataVisiter.forEach((user) => {
		if (!group.users.find((el) => el.equals(user._id))) group.users.push(user);
	});
	await group.save();
	return group;
};
