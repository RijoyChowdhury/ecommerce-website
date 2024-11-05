const ProductModel = require('../models/product');
const { 
    getAllFactory, 
    createFactory, 
    getByIdFactory, 
    updateByIdFactory, 
    deleteByIdFactory, 
    checkDataFactory,
    getQueryParamsFactory
} = require('../utils/crud-factory');

const checkProductDataPresent = checkDataFactory(ProductModel);
const getAllProductsHandler = getAllFactory(ProductModel);
const createProductHandler = createFactory(ProductModel);
const getProductByIdHandler = getByIdFactory(ProductModel);
const updateProductByIdHandler = updateByIdFactory(ProductModel);
const deleteProductByIdHandler = deleteByIdFactory(ProductModel);
const getQueryParamsHandler = getQueryParamsFactory();

module.exports = {
    checkProductDataPresent,
    getAllProductsHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductByIdHandler,
    getQueryParamsHandler
}