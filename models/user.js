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
});

module.exports = mongoose.model("User", userSchema);