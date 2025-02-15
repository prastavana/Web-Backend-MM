// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const songController = require('../controller/songController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Route for creating songs
router.post('/songs', uploadMiddleware, songController.createSong);

// Route for parsing DOCX files
router.post('/songs/parse-docx', uploadMiddleware, songController.parseDocxFile);
// Add this to your existing songRoutes.js

// Route for fetching all songs
router.get('/getsongs', songController.getAllSongs);

module.exports = router;


module.exports = router;
