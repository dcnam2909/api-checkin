const Group = require('../models/GroupVisiter');

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
