const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const cartRoutes = require('./cartRoutes');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/review', reviewRoutes);
router.use('/cart', cartRoutes);


module.exports = router;