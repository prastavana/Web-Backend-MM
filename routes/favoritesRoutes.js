const express = require('express');
const router = express.Router();
const favoritesController = require('../controller/favoritesController'); // Adjust the path as necessary
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, favoritesController.getFavorites); // Get favorites
router.post('/songs', verifyToken, favoritesController.toggleFavoriteSong); // Add/remove song favorite
router.post('/lessons', verifyToken, favoritesController.toggleFavoriteLesson); // Add/remove lesson favorite

module.exports = router;
