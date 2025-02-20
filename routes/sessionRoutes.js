const express = require('express');
const uploadMiddleware = require("../middleware/uploadMiddleware"); // Import your upload middleware
const sessionController = require('../controller/sessionController');
const router = express.Router();

// Route to create a new session
router.post('/', uploadMiddleware, sessionController.createSession);

// Route to get all sessions
router.get('/', sessionController.getAllSessions);

module.exports = router;
