const express = require('express');
const userRoutes = require('./user');
const productRoutes = require('./product');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/product', productRoutes);

module.exports = router;