const express = require('express');
const multer = require('multer'); // For file upload handling
const sessionController = require('../controller/sessionController');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // You can specify a folder here for your file storage
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /image\/png|video\/mp4|application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
        if (!allowedFileTypes.test(file.mimetype)) {
            return cb(new Error('Invalid file type. Only .png, .mp4, .pdf, .docx are allowed.'));
        }
        cb(null, true);
    }
});

// Route to create a new session
router.post('/', upload.single('file'), sessionController.createSession);

// Route to get all sessions
router.get('/', sessionController.getAllSessions);

module.exports = router;
