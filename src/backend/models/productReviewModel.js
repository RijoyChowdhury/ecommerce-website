const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema rules
const productReviewSchema = Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must contain some rating.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Product"
    },
});

module.exports = mongoose.model("ProductReview", productReviewSchema);