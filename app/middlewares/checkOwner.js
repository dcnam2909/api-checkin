const AppError = require('../config/AppError');
const eventService = require('../services/event.service');

module.exports = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const userId = req.body.user._id;
		const check = await eventService.eventOwner(idEvent, userId);
		if (!check) throw new AppError('You can not access to this event', 401);
		next();
	} catch (error) {
		next(error);
	}
};
