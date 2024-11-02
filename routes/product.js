const express = require('express');
const createError = require('http-errors');
const ProductModel = require('../models/product');
const { isObjectEmpty } = require('../utils/shared-utils');

const router = express.Router();

const checkRequestBody = (req, res, next) => {
    try {
        if (isObjectEmpty(req.body)) {
            throw createError.BadRequest('Bad payload.');
        }
        next();
    } catch (err) {
        next(err);
    }
}

const checkProductDataPresent = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const productDetails = await ProductModel.findById(productId) ?? {};
        if (isObjectEmpty(productDetails)) {
            throw createError.NotFound('Product details not found.');
        }
        next();
    } catch (err) {
        next(err);
    }
}

const getAllProductsHandler = async (req, res, next) => {
    try {
        const productData = await ProductModel.find();
        if (productData.length === 0) {
            throw createError.NotFound('No products found.');
        }
        res.status(200).json({
            status: 'success',
            data: productData,
        });
    } catch (err) {
        next(err);
    }
}

const createProductHandler = async (req, res, next) => {
    try {
        const productDetails = req.body;
        await ProductModel.create(productDetails)
        res.status(200).json({
            status: 'success',
            message: 'Product created.',
        });
    } catch (err) {
        next(err);
    }
}

const getProductByIdHandler = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const productDetails = await ProductModel.findById(productId);
        res.status(200).json({
            status: 'success',
            data: productDetails,
        });
    } catch (err) {
        next(err);
    }
}

const updateProductByIdHandler = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const newProductDetails = req.body;
        await ProductModel.findByIdAndUpdate(productId, newProductDetails);
        res.status(200).json({
            status: 'success',
            message: 'Product details updated.',
        });
    } catch (err) {
        next(err);
    }
}

const deleteProductByIdHandler = async (req, res, next) => {
    try {
        const { productId } = req.params;
        await ProductModel.findByIdAndDelete(productId);
        res.status(200).json({
            status: 'success',
            message: 'Product deleted.',
        });
    } catch (err) {
        next(err);
    }
}

// get users
router.get('/', getAllProductsHandler);
// get user by id
router.get('/:productId', checkProductDataPresent, getProductByIdHandler);
// create user
router.post('/', checkRequestBody, createProductHandler);
// update user details by userId
router.post('/productId', checkRequestBody, checkProductDataPresent, updateProductByIdHandler);
// delete user by Id
router.delete('/:productId', checkProductDataPresent, deleteProductByIdHandler);

module.exports = router;