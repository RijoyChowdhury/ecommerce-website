const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema rules
const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password length should be 8 characters and more.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    token: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    role: {
        type: String,
        default: 'User'
    },
    bookings: {
        type: [mongoose.Schema.ObjectId],
        ref: "Booking"
    },
});

const validRoles = ['Admin', 'User', 'Seller'];

userSchema.pre('save', function (next) {
    const user = this;
    if (user.role) {
        if (validRoles.includes(user.role)) {
            next();
        } else {
            const err = createError.BadRequest(`${user.role} is not a valid role.`);
            return next(err);
        }
    }
    user.role = 'User';
    next();
})

module.exports = mongoose.model("User", userSchema);