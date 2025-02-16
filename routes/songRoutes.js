const express = require('express');
const router = express.Router();
const parseDocxText = require("../utils/parseDocxText");


const songController = require('../controller/songController'); // Ensure this path is correct

const uploadMiddleware = require('../middleware/uploadMiddleware');

// Route for creating songs
router.post('/create', uploadMiddleware, songController.createSong); // Path adjusted to match RESTful API conventions

// Route for parsing DOCX files (this can be optional depending on your project flow)
router.post('/parse-docx', uploadMiddleware, songController.parseDocxFile); // Added handling for DOCX file parsing

// Route for fetching all songs
router.get('/getsongs', songController.getAllSongs); // Simplified to just `/` for fetching all songs

// Route for fetching a song by ID
router.get('/:id', songController.getSongById);  // Fetch a specific song by ID

module.exports = router;
