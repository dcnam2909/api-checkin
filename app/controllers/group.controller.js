const groupService = require('../services/group.service');

exports.getGroup = async (req, res, next) => {
	try {
		const groups = await groupService.getGroup();
		res.status(200).json({
			message: 'success',
			groups,
		});
	} catch (err) {
		next(err);
	}
};

exports.createGroup = async (req, res, next) => {
	try {
		const data = {
			groupName: req.body.groupName,
		};
		const group = await groupService.createGroup(data);
		res.status(200).json({
			message: 'success',
			group,
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteGroup = async (req, res, next) => {
	try {
		const idGroup = req.params.idGroup;
		const group = await groupService.deleteGroup(idGroup);
		res.status(200).json({
			message: 'success',
		});
	} catch (error) {
		next(error);
	}
};

exports.addToGroup = async (req, res, next) => {
	try {
		const idGroup = req.params.idGroup;
		const list = req.body.listVisiter;
		const group = await groupService.addToGroup(idGroup, list);
		res.status(200).json({
			message: 'success',
			group,
		});
	} catch (error) {
		next(error);
	}
};
