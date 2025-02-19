const express = require('express');
const multer = require('multer'); // For file upload handling
const sessionController = require('../controller/sessionController');
const uploadMiddleware = require("../middleware/uploadMiddleware");
const router = express.Router();



// Route to create a new session
router.post('/', uploadMiddleware, sessionController.createSession);

// Route to get all sessions
router.get('/', sessionController.getAllSessions);

module.exports = router;
