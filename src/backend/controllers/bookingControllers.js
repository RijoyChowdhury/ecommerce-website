const Razorpay = require('razorpay');
const crypto = require('crypto');
const createError = require('http-errors');
const BookingModel = require('../models/bookingModel');
const UserModel = require('../models/userModel');

const { RAZRPAY_PUBLIC_KEY, RAZRPAY_PRIVATE_KEY, WEBHOOK_SECERET } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZRPAY_PUBLIC_KEY,
    key_secret: RAZRPAY_PRIVATE_KEY,
});

const initialBookingHandler = async (req, res, next) => {
    const userId = req.userId;
    const { priceAtThatTime } = req.body;
    const { productId } = req.params;
    const status = "pending";
    try {
        /**************create a booking document************/
        const bookingObject = await BookingModel.create({
            user: userId,
            product: productId,
            priceAtThatTime: priceAtThatTime,
            status: status,
        })
        const userObject = await UserModel.findById(userId);
        userObject.bookings.push(bookingObject['_id'])
        await userObject.save();

        /****************initiating the payment*************/
        const amount = bookingObject.priceAtThatTime;
        const currency = 'INR';
        const payment_capture = 1;
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: bookingObject['_id'],
            payment_capture: payment_capture,
        }
        const orderObject = await razorpayInstance.orders.create(options);
        bookingObject.payment_order_id = orderObject.id;
        await bookingObject.save();
        res.status(200).json({
            status: 'success',
            message: {
                id: orderObject.id,
                currency: orderObject.currency,
                amount: orderObject.amount
            }
        })
    } catch (err) {
        next(err);
    }
}

const getAllBookingsHandler = async (req, res, next) => {
    try {
        const allBookings = await BookingModel.find()
            .populate({ path: 'user', select: 'name email' })
            .populate({ path: 'product', select: 'name  brand productImages' })
        res.status(200).json({
            status: 'success',
            message: allBookings
        })
    } catch (err) {
        next(err);
    }

}

const verifyPaymentHandler = async function (req, res, next) {
    try {
        const shasum = crypto.createHmac('sha256', WEBHOOK_SECERET);
        shasum.update(JSON.stringify(req.body));
        const freshSignature = shasum.digest('hex');
        const razorPaySign = req.headers['x-razorpay-signature'];
        console.log(freshSignature, razorPaySign);
        if (freshSignature === razorPaySign) {
            const orderId = req.body.payload.payment.entity.order_id;
            const bookingObject = await BookingModel.findOne({ payment_order_id: orderId });
            bookingObject.status = 'sucess';
            delete bookingObject.payment_order_id
            await bookingObject.save();
            res.status(200).json({
                message: 'OK',
            });
        } else {
            throw createError.Forbidden('Access Denied');
        }

    } catch (err) {
        next(err);
    }
}

module.exports = {
    initialBookingHandler,
    verifyPaymentHandler,
    getAllBookingsHandler
}