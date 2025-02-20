const Quiz = require('../model/Quiz');
const path = require('path');

exports.createQuiz = async (req, res) => {
    try {
        const { day, question, options, correctAnswer } = req.body;
        const chordDiagram = req.file ? req.file.path : null;

        const newQuiz = new Quiz({
            day,
            question,
            options,
            correctAnswer,
            chordDiagram,
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Quiz added successfully!', quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Error adding quiz', error: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
};
