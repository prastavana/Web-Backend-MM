const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    chordDiagram: {
        type: String, // Store the file path as a string
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
