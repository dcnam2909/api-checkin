const User = require('../models/User');

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

exports.getAllUsers = async (query) => {
	if (query) return await User.find(query);
	return await User.find({ role: { $eq: 'Visiter' } });
};
