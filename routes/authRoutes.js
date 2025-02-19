const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, sendResetPasswordMail, getUserProfile} = require('../controller/authController');
const {reset} = require("nodemon");
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/sendResetMailPassword', sendResetPasswordMail);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyToken, getUserProfile);


module.exports = router;
