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
	const user = await User.findById(tokenDecode.id);
	if (await user.changedPasswordAfter(tokenDecode.iat))
		return null;
	return user;
};
