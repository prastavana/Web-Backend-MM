// routes/songRoutes.js

const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const songController = require('../controllers/songController');

// Route for adding songs with file uploads
router.post('/add-chord', uploadMiddleware.fields([{ name: 'docxFile' }, { name: 'chordDiagrams', maxCount: 10 }]), songController.addSong);

module.exports = router;
