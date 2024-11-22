const express = require('express');
const { protectRouteHandler } = require('../controllers/authController');
const {
    createReviewHandler,
    getAllReviewsForProductHandler
} = require('../controllers/reviewControllers');

const router = express.Router();

router.post('/:productId', protectRouteHandler, createReviewHandler);
router.get('/:productId', getAllReviewsForProductHandler);

module.exports = router;