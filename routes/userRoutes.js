const express = require('express');
const { checkRequestBody } = require('../utils/route-utils');
const { 
    checkUserDataPresent,
    getAllUsersHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler 
} = require('../controllers/userControllers');
const {isAdmin} = require('../controllers/authController');

const router = express.Router();

// get users
router.get('/', isAdmin, getAllUsersHandler);
// get user by id
router.get('/:id', checkUserDataPresent, getUserByIdHandler);
// create user
router.post('/', isAdmin, checkRequestBody, createUserHandler);
// update user details by userId
router.post('/:id', checkRequestBody, checkUserDataPresent, updateUserByIdHandler);
// delete user by Id
router.delete('/:id', isAdmin, checkUserDataPresent, deleteUserByIdHandler);

module.exports = router;