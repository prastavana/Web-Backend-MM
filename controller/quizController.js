const Quiz = require('../model/Quiz');
const path = require('path');
const fs = require('fs');

// Function to handle adding a quiz
exports.addQuiz = async (req, res) => {
    try {
        const { day, question, options, correctAnswer } = req.body;

        // Handle file upload
        const chordDiagram = req.file ? req.file.path : null;

        const newQuiz = new Quiz({
            day,
            question,
            chordDiagram,
            options,
            correctAnswer,
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Quiz added successfully!', quiz: newQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add quiz', error });
    }
};
