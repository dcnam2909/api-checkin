const User = require('../models/User');


exports.createUser = async (data) => {
	return await User.create(data);
};

exports.checkUser = async (username, password) => {
	const user = await User.findOne({username}).select('+password +role');
	if (user && (await user.comparePassword(password))) {
		return { id: user._id, role: user.role };
	}
};
