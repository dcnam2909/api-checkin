const mongoose = require('mongoose');
const User = require('./User');

const GroupVisiterSchema = new mongoose.Schema(
	{
		groupName: {
			type: String,
			required: true,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('GroupVisiter', GroupVisiterSchema);
