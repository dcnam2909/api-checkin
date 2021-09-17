const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const valid = require('validator');

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
			minlength: 4,
			maxlength: 20,
		},
		password: {
			type: String,
			required: true,
			select: false,
			minlength: 8,
			maxlength: 32,
		},
		passwordChangeAt: {
			type: Date,
		},
		firstName: {
			type: String,
			required: true,
			maxlength: 15,
		},
		lastName: {
			type: String,
			required: true,
			maxlength: 15,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: valid.isEmail,
				message: 'This must be an email',
			},
		},
		phone: Number,
		birthday: {
			type: Date,
			required: isUser(),
			transform: (date) => `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
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

UserSchema.pre('save', async function (next) {
	if (this.isModified('password') && !this.isNew) {
		this.passwordChangeAt = Date.now();
	}
	next();
});

UserSchema.pre(/^find/, async function (next) {
	this.select('-__v -updatedAt -createdAt');
	next();
});

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.changedPasswordAfter = function (timeCreateToken) {
	if (this.passwordChangeAt) {
		const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
		return timeCreateToken < changedTimestamp;
	}
	// False means NOT changed
	return false;
};

module.exports = mongoose.model('User', UserSchema);
