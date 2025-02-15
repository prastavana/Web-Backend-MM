const express = require('express');
const router = express.Router();
const songController = require('../controller/songController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Route for creating songs
router.post('/', uploadMiddleware, songController.createSong); // Updated the path to match API convention

// Route for parsing DOCX files
router.post('/parse-docx', uploadMiddleware, songController.parseDocxFile);

// Route for fetching all songs
router.get('/getsongs', songController.getAllSongs);

// Route for fetching a song by ID
router.get('/:id', songController.getSongById);  // New route for fetching a song by ID

module.exports = router;
