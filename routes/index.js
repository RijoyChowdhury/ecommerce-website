const express = require('express');
const createError = require('http-errors');
const UserModel = require('../models/user');
const {isObjectEmpty} = require('../utils/shared-utils');

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

const checkUserDataPresent = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const userDetails = await UserModel.findById(userId) ?? {};
        if (isObjectEmpty(userDetails)) {
            throw createError.NotFound('User details not found.');
        }
        next();
    } catch (err) {
        next(err);
    }
}

const getAllUsersHandler = async (req, res, next) => {
    try {
        const userData = await UserModel.find();
        if (userData.length === 0) {
            throw createError.NotFound('No users found.');
        }
        res.status(200).json({
            status: 'success',
            data: userData,
        });
    } catch (err) {
        next(err);
    }
}

const createUserHandler = async (req, res, next) => {
    try {
        const userDetails = req.body;
        await UserModel.create(userDetails)
        res.status(200).json({
            status: 'success',
            message: 'User created.',
        });
    } catch (err) {
        next(err);
    }
}

const getUserByIdHandler = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const userDetails = await UserModel.findById(userId);
        res.status(200).json({
            status: 'success',
            data: userDetails,
        });
    } catch (err) {
        next(err);
    }
}

const updateUserByIdHandler = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const newUserDetails = req.body;
        await UserModel.findByIdAndUpdate(userId, newUserDetails);
        res.status(200).json({
            status: 'success',
            message: 'User details updated.',
        });
    } catch (err) {
        next(err);
    }
}

const deleteUserByIdHandler = async (req, res, next) => {
    try {
        const {userId} = req.params;
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({
            status: 'success',
            message: 'User deleted.',
        });
    } catch (err) {
        next(err);
    }
}

// get users
router.get('/user', getAllUsersHandler);
// get user by id
router.get('/user/:userId', checkUserDataPresent, getUserByIdHandler);
// create user
router.post('/user', checkRequestBody, createUserHandler);
// update user details by userId
router.post('/user/:userId', checkRequestBody, checkUserDataPresent, updateUserByIdHandler);
// delete user by Id
router.delete('/user/:userId', checkUserDataPresent, deleteUserByIdHandler);

module.exports = router;