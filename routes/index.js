const express = require("express");
const router = express.Router();

// get user
router.get('/user', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'sending user data',
  });
});

// post user details
router.post('/user', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'receiving data',
        data: req.body,
    });
})

module.exports = router;