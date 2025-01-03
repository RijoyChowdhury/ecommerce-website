const express = require('express');
const { checkRequestBody } = require('../utils/route-utils');
const { 
    checkUserDataPresent,
} = require('../controllers/userControllers');
const {isAdmin, protectRouteHandler} = require('../controllers/authController');
const UserModel = require('../models/userModel');

const router = express.Router();

router.use(protectRouteHandler);

const getCartInfoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await UserModel.findById(id).populate({
            path: 'cart.product',
        });
        res.status(200).json({
            status: 'success',
            data: data.cart,
        });
    } catch (err) {
        next(err);
    }
}

const updateCartInfoById = async (req, res, next) => {
    try {

    } catch (err) {

    }
}

// // get users
// router.get('/', isAdmin, getAllUsersHandler);
// get user by id
router.get('/:id', checkUserDataPresent, getCartInfoById);
// // create user
// router.post('/', isAdmin, checkRequestBody, createUserHandler);
// update user details by userId
router.post('/:id', checkRequestBody, checkUserDataPresent, updateCartInfoById);
// // delete user by Id
// router.delete('/:id', isAdmin, checkUserDataPresent, deleteUserByIdHandler);

module.exports = router;