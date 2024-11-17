const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema rules
const bookingSchema = Schema({
    bookedAt: {
        type: Date,
        default: Date.now()
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: [true, 'Please provide total amount to be paid.']
    },
    status: {
        type: String,
        enum: ["pending", "failed", "sucess"],
        required: true,
        default: "pending"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please provide customer id.'],
        ref: "User"
    },
    product: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please provide product id.'],
        ref: "Product"
    },
    payment_order_id: {
        type: String
    }
});

module.exports = mongoose.model("Booking", bookingSchema);