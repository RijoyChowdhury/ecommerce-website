const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');
const bookingRoutes = require('./bookingRoutes');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);


module.exports = router;