const User = require('../models/User');

exports.createUser = async (data) => {
	return await User.create(data);
};

exports.findOneUser = async (param) => {
	return await User.findOne(param);
};

exports.findUsers = async (param) => {
	return await User.find(param);
};

exports.login = async (username, password) => {
	const user = await User.findOne({ username }).select('+password +role');
	if (user && (await user.comparePassword(password, user.password))) {
		return { id: user._id, role: user.role };
	}
};
