const userService = require('../services/user.service');

exports.getInfo = async (req, res, next) => {
	try {
		const user = await userService.findOneUser({
			id: req.body.tokenDecode.id,
		});
        res.status(200).json({
            user
        })
	} catch (error) {
		next(error);
	}
};
