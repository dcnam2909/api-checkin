const AppError = require('../config/AppError');
const eventService = require('../services/event.service');

module.exports = async (req, res, next) => {
	try {
		const idEvent = req.params.idEvent;
		const managerId = req.body.user._id;
		console.log(req.body.user);
		const checkOwner = await eventService.eventOwner(idEvent, managerId);
		if (!checkOwner) throw new AppError('You are not own this event', 401);
		next();
	} catch (error) {
		next(error);
	}
};
