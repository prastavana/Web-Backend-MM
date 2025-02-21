const express = require('express');
const uploadMiddleware = require("../middleware/uploadMiddleware"); // Import your upload middleware
const quizController = require('../controller/quizController');
const router = express.Router();

// Route to create a new quiz
router.post('/addquiz', uploadMiddleware, quizController.createQuiz);

// Route to get all quizzes
router.get('/', quizController.getAllQuizzes);

module.exports = router;
