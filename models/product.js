const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema rules
const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        unique: [true, 'Product name should be unique.'],
        maxlength: [40, 'Length of product name is more than 40 characters.'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.'],
        validate: {
            validator: function () {
                return this.price > 0;
            },
            message: 'Price of the product cannot be negative.'
        }
    },
    categories: {
        type: String,
        required: true
    },
    productImages: {
        type: [String]
    },
    averageRating: Number,
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message: 'Discount amount must be less than actual price',
        },
    },
});

module.exports = mongoose.model('Product', productSchema);