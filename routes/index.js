const express = require('express');
const createError = require('http-errors');
const promisify = require('util').promisify;
const jwt = require('jsonwebtoken');
const userRoutes = require('./user');
const productRoutes = require('./product');
const UserModel = require('../models/user');
const {otpGenerator} = require('../utils/shared-utils');
const sendEmail = require('../utils/mailer/sendMailUtility');

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

const signUpHandler = async (req, res, next) => {
    try {
        const userData = req.body;
        let newUser = await UserModel.create(userData);
        res.status(200).json({
            status: 'success',
            message: 'User created.'
        });
    } catch (err) {
        next(err);
    }
}

const loginHandler = async (req, res, next) => {
    try {
        let {email, password, rememberUser = false} = req.body;
        let user = await UserModel.findOne({email});
        if (user) {
            if (password === user.password) {
                if (rememberUser) {
                    const authToken = await jwtSign({
                        id: user['_id']
                    }, process.env.SECRET_KEY, {
                        expiresIn: '1h',
                        algorithm: 'HS256'
                    });
                    res.cookie('jwt', authToken, {maxAge: 900000000, httpOnly: true, path: '/'});
                }
                res.status(200).json({
                    status: 'success',
                    message: 'User logged in.',
                });
            } else {
                res.status(404).json({
                    status: 'failure',
                    message: 'Wrong credentials.'
                });
            }
        } else {
            throw createError.NotFound('User does not exist.');
        }
    } catch (err) {
        next(err);
    }
}

const createToken = async (req, res, next) => {
    const authToken = await jwtSign({
        data: req.body
    }, process.env.SECRET_KEY, {
        expiresIn: '1h',
        algorithm: 'HS256'
    });
    res.cookie('jwt', authToken, {maxAge: 900000000, httpOnly: true, path: '/'});
    res.status(200).json({
        message: 'User signed in.',
        authToken
    });
}

const protectRouteHandler = async function (req, res, next) {
    try {
        let jwttoken =req.cookies.jwt;
        console.log(jwttoken)
        let decryptedToken = await jwtVerify(jwttoken, process.env.SECRET_KEY);
        if (decryptedToken) {
            let userId = decryptedToken.id;
            req.userId = userId;
            next();
        }
    } catch (err) {
        next(err);
    }
}

const getUserDataHandler = async function (req, res, next) {
    try {
        const id = req.userId;
        const user = await UserModel.findById(id);
        res.status(200).json({
            "message": "user data retrieved  successfully",
            user: user
        })
    } catch (err) {
        next(err);
    }
}

const forgetPasswordHandler = async function (req, res, next) {
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({email});
        if (!user) {
            throw createError.NotFound('User does not exist.');
        }
        const generatedOtp = otpGenerator();
        sendEmail(generatedOtp, user.name, user.email);
        user.token = generatedOtp;
        user.otpExpiry = Date.now() + 1000*60*60;
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'OTP sent.'
        });
    } catch (err) {
        next(err);
    }
}

const resetPasswordHandler = async function (req, res, next) {
    try {
        const userId = req.params.id;
        const {password, otp} = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw createError.NotFound('User does not exist.');
        }
        if (otp && user.token === otp) {
            const currentTime = Date.now();
            if (currentTime < user.otpExpiry) {
                user.password = password;
                delete user.token;
                delete user.otpExpiry;
                await user.save();
                res.status(200).json({
                    status: 'success',
                    message: 'Password updated.'
                });
            }
        }
        throw createError.Forbidden('Invalid OTP');
    } catch (err) {
        next(err);
    }
}

const router = express.Router();
router.use('/user', userRoutes);
router.use('/product', productRoutes);

router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
router.use('/getUserDetails', protectRouteHandler, getUserDataHandler);
router.patch('/forgetPassword', forgetPasswordHandler);
router.patch('/resetPassword/:id', resetPasswordHandler);

module.exports = router;