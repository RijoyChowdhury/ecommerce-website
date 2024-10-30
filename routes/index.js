const express = require('express');
const fs = require('fs');
const shortUUID = require('short-uuid');

const router = express.Router();
const filePath = require.resolve('./user-data.json');
const userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const isRequestBodyEmpty = (payload) => {
    return Object.keys(payload).length === 0;
}

const writeUserDataToDB = (id, userDetails) => {
    const userDetailsObject = {id, ...userDetails};
    userData.push(userDetailsObject);
    const storeData = JSON.stringify(userData);
    fs.writeFileSync(filePath, storeData);
}

// request body checker
router.use((req, res, next) => {
    try {
        if (req.method === 'POST' && isRequestBodyEmpty(req.body)) {
            throw new Error('Bad payload.');
        }
        next();
    } catch (err) {
        err.status = 400; // bad request
        next(err);
    }
});

// get user
router.get('/user', (req, res, next) => {
    try {
        if (userData.length !== 0) {
            throw new Error('No users found.');
        }
        res.status(200).json({
            status: 'success',
            message: userData,
        });
    } catch (err) {
        err.status = 404; // data not found
        next(err);
    }
});

// create user
router.post('/user', (req, res) => {
    const id = shortUUID.generate();
    writeUserDataToDB(id, req.body);
    res.status(200).json({
        status: 'success',
        message: 'User data added',
    });
})

module.exports = router;