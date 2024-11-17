const express = require('express');
const {
    initialBookingHandler,
    verifyPaymentHandler,
    getAllBookingsHandler
} = require('../controllers/bookingControllers');
const { protectRouteHandler } = require('../controllers/authController');

const router = express.Router();

router.use(protectRouteHandler);

router.post('/:productId', initialBookingHandler)
router.post('/verify', verifyPaymentHandler)
router.get('/', getAllBookingsHandler);



module.exports = router;