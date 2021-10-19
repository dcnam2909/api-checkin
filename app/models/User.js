const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const valid = require('validator');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username can not be empty'],
            unique: true,
            lowercase: true,
            minlength: 4,
            maxlength: 20,
        },
        password: {
            type: String,
            required: [true, 'Password can not be empty'],
            select: false,
            minlength: 8,
            maxlength: 32,
        },
        passwordChangeAt: {
            type: Date,
            select: false,
        },
        fullName: {
            type: String,
            required: [true, 'Please enter your fullname'],
            maxlength: 30,
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            validate: {
                validator: valid.isEmail,
                message: 'This must be an email',
            },
        },
        phone: Number,
        address: String,
        workUnit: String,
        addressUnit: String,
        idCB: String,
        idSV: String,
        role: {
            type: String,
            enum: ['Visiter', 'Manager', 'Agent', 'Admin'],
            default: 'Visiter',
        },
    },
    {timestamps: true},
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
