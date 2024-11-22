const ProductModel = require('../models/productModel');
const ReviewModel = require('../models/productReviewModel');

const createReviewHandler = async function (req, res, next) {
    try {
        const userId = req.userId;
        const productId = req.params.productId;
        const { review, rating } = req.body;
        
        const reviewObject = await ReviewModel.create({
            review,
            rating,
            product: productId,
            user: userId
        })

        const productObject = await ProductModel.findById(productId);
        const averageRating = productObject.averageRating;
        if (averageRating) {
            let sum = productObject.averageRating * productObject.reviews.length;
            let finalAvgRating =
                (sum + reviewObject.rating) / (productObject.reviews.length + 1);
            productObject.averageRating = finalAvgRating
        } else {
            productObject.averageRating = reviewObject.rating;
        }

        productObject.reviews.push(reviewObject['_id']);
        await productObject.save();
        res.status(200).json({
            status: 'success',
            message: reviewObject
        })
    } catch (err) {
        next(err);
    }
}

const getAllReviewsForProductHandler = async function (req, res, next) {
    try {
        const productId = req.params.productId;
        const allReviews = await ProductModel.findById(productId)
            .populate({ path: 'reviews', select: 'review rating user createdAt' })
        res.status(200).json({
            status: 'success',
            message: allReviews
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createReviewHandler,
    getAllReviewsForProductHandler
}