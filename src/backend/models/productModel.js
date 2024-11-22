const mongoose = require('mongoose');
const createError = require('http-errors');
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
        type: [String],
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
            message: 'Discount amount must be less than actual price.',
        },
    },
    description: {
        type: String,
        required: [true, 'Product description is required.'],
        maxlength: [2000, 'Product description cannot be greater than 2000 characters.']
    },
    stock_quantity: {
        type: Number,
        required: [true, 'Product inventory count is required.'],
        validate: function () {
            return this.stock_quantity >= 0;
        },
        message: 'Inventory count cannot be negative.',
    },
    brand: {
        type: String,
        required: [true, 'Product brand is required.'],
    },
    reviews: {
        type: [mongoose.Schema.ObjectId],
        ref:"ProductReview"
    }
});

const validCategories = ['Electronics', 'Audio', 'Clothing', 'Accessories', 'Fashion', 'Shoes', 'Sports', 'Photography', 'Men\'s Fashion', 'Technology'];

productSchema.pre('save', function (next) {
    const product = this;
    const invalidCategories = product.categories.filter(category => !validCategories.includes(category));
    if (invalidCategories.length === 1) {
        const err = createError.BadRequest(`${invalidCategories.join()} is not a valid category.`);
        return next(err);
    }
    if (invalidCategories.length > 1) {
        const err = createError.BadRequest(`${invalidCategories.join()} are not valid categories.`);
        return next(err);
    }
    next();
})

module.exports = mongoose.model('Product', productSchema);