const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/auth', authRoutes);


module.exports = router;