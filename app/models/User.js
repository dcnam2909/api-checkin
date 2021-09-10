const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

function isUser() {
	return this.role === 'user';
}
const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		passwordChangeAt: Date,
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: Number,
		birthday: {
			type: Date,
			required: isUser(),
			transform: date => `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
		},
		address: {
			city: {
				type: String,
				required: isUser(),
			},
			address: {
				type: String,
				required: [isUser(), 'Adress can not be empty'],
			},
		},
		company: {
			type: String,
			required: [
				function () {
					return this.role === 'manager';
				},
				'Company can not be empty',
			],
		},
		role: {
			type: String,
			enum: ['user', 'manager', 'admin'],
			default: 'user',
			select: false,
		},
	},
	{ timestamps: true },
);

UserSchema.pre('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});


UserSchema.pre(/^find/,async function(next) {
	this.select('-__v');
	console.log(typeof this.birthday);
	next()
});

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
