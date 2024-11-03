const express = require('express');
const { checkRequestBody } = require('../utils/route-utils');
const { 
    checkProductDataPresent,
    getAllProductsHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductByIdHandler
} = require('../controllers/productControllers');

const router = express.Router();

// get users
router.get('/', getAllProductsHandler);
// get user by id
router.get('/:id', checkProductDataPresent, getProductByIdHandler);
// create user
router.post('/', checkRequestBody, createProductHandler);
// update user details by userId
router.post('/:id', checkRequestBody, checkProductDataPresent, updateProductByIdHandler);
// delete user by Id
router.delete('/:id', checkProductDataPresent, deleteProductByIdHandler);

module.exports = router;