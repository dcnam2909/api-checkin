const User = require('../models/User');

exports.getOneVisiter = async (id) => {
	return await User.findById(id);
};

exports.changePass = async (id, currentPass, newPass) => {
	const user = await User.findById(id).select('+password');
	if (await user.comparePassword(currentPass)) {
		user.password = newPass;
		await user.save();
		return user;
	}
	return null;
};

exports.checkPassChanged = async (tokenDecode) => {
	const user = await User.findById(tokenDecode.id).select('+passwordChangeAt');
	if (await user.changedPasswordAfter(tokenDecode.iat)) return null;
	return user;
};

exports.updateInfo = async (id, dataUpdate) => {
	return await User.findByIdAndUpdate(id, dataUpdate, {
		runValidators: true,
		new: true,
	});
};

exports.getAllVisiters = async () => {
	return await User.find({ role: { $eq: 'Visiter' } });
};

exports.getAllAgents = async () => {
	return await User.find({ role: { $eq: 'Agent' } });
};

exports.getAllUsers = async () => {
	return await User.find();
};
