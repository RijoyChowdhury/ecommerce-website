const express = require('express');
const fs = require('fs');
const createError = require("http-errors");
const shortUUID = require('short-uuid');

const router = express.Router();
const filePath = require.resolve('./user-data.json');
let userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const isPayloadEmpty = (payload) => {
    return Object.keys(payload).length === 0;
}

const updateUserDB = () => {
    const storeData = JSON.stringify(userData);
    fs.writeFileSync(filePath, storeData);
}

const deleteUserFromDB = (id) => {
    userData = userData.filter(user => user.id !== id);
    updateUserDB();
}


const writeUserDataToDB = (id, userDetails) => {
    const userDetailsObject = {id, ...userDetails};
    userData.push(userDetailsObject);
    updateUserDB();
}

const updateUserDataToDB = (id, userDetails) => {
    deleteUserFromDB(id);
    writeUserDataToDB(id, userDetails);
}

const getUserDetailsById = id => {
    const userDetails = userData.find(user => user.id === id);
    return userDetails ?? {};
}

const checkPostRequestBody = (req, res, next) => {
    try {
        if (req.method === 'POST' && isPayloadEmpty(req.body)) {
            throw createError.BadRequest('Bad payload.');
        }
        next();
    } catch (err) {
        next(err);
    }
}

const getUsersHandler = (req, res, next) => {
    try {
        if (userData.length !== 0) {
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

const createUserHandler = (req, res, next) => {
    try {
        const id = shortUUID.generate();
        writeUserDataToDB(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'User data added',
        });
    } catch (err) {
        next(err);
    }
}

const getUserByIdHandler = (req, res, next) => {
    try {
        const {userId} = req.params;
        const userDetails = getUserDetailsById(userId);
        if (isPayloadEmpty(userDetails)) {
            throw createError.NotFound('User details not found.');
        }
        res.status(200).json({
            status: 'success',
            data: userDetails,
        });
    } catch (err) {
        next(err);
    }
}

const updateUserByIdHandler = (req, res, next) => {
    try {
        const {userId} = req.params;
        const newUserDetails = req.body;
        const userDetails = getUserDetailsById(userId);
        if (isPayloadEmpty(userDetails)) {
            throw createError.NotFound('User details not found.');
        }
        updateUserDataToDB(userId, Object.assign(userDetails, newUserDetails));
        res.status(200).json({
            status: 'success',
            data: userDetails,
        });
    } catch (err) {
        next(err);
    }
}

const deleteUserByIdHandler = (req, res, next) => {
    try {
        const {userId} = req.params;
        const userDetails = getUserDetailsById(userId);
        if (isPayloadEmpty(userDetails)) {
            throw createError.NotFound('User details not found.');
        }
        deleteUserFromDB(userId);
        res.status(200).json({
            status: 'success',
            message: 'User deleted.',
        });
    } catch (err) {
        next(err);
    }
}

// request body checker
router.use(checkPostRequestBody);

// get users
router.get('/user', getUsersHandler);

// get user by id
router.get('/user/:userId', getUserByIdHandler);

// create user
router.post('/user', createUserHandler);

// update user details by userId
router.post('/user/:userId', updateUserByIdHandler);

// delete user by Id
router.delete('/user/:userId', deleteUserByIdHandler);

module.exports = router;