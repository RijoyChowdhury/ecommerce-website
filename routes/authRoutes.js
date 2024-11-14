const express = require('express');
const {
    signUpHandler,
    loginHandler,
    forgetPasswordHandler,
    resetPasswordHandler
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
router.patch('/forgetPassword', forgetPasswordHandler);
router.patch('/resetPassword/:id', resetPasswordHandler);

module.exports = router;