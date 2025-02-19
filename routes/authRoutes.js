const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, sendResetPasswordMail, getUserProfile, updatePassword,
    updateProfile
} = require('../controller/authController');
const {reset} = require("nodemon");
const { verifyToken } = require('../middleware/authMiddleware');
const profileUpload = require("../middleware/profileUploadMiddleware");


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/sendResetMailPassword', sendResetPasswordMail);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyToken, getUserProfile);
router.put("/update-profile", verifyToken, profileUpload, updateProfile);


module.exports = router;
