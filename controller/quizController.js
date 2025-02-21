const Quiz = require("../model/Quiz");

exports.createQuiz = async (req, res) => {
    try {
        const { quizData } = req.body; // Extract quizData from the body

        // Parse the quizData string into an object
        const parsedQuizData = JSON.parse(quizData);

        // Create a new quiz entry
        const newQuiz = new Quiz({
            day: parsedQuizData.day,
            instrument: parsedQuizData.instrument, // Save the selected instrument
            quizzes: parsedQuizData.quizzes.map(quiz => ({
                question: quiz.question,
                options: quiz.options,
                correctAnswer: quiz.correctAnswer,
                chordDiagram: quiz.chordDiagram ? quiz.chordDiagram : null, // Save the chord diagram filename or path
            })),
        });

        // Save the new quiz entry to the database
        await newQuiz.save();

        // Handle file uploads (chord diagrams)
        if (req.files['chordDiagrams']) {
            req.files['chordDiagrams'].forEach((file) => {
                // Process the file as needed (e.g., move it to a specific location)
            });
        }

        res.status(201).json({ message: 'Quizzes added successfully!', quizId: newQuiz._id });
    } catch (error) {
        console.error("Error adding quizzes:", error);
        res.status(500).json({ message: 'Error adding quizzes. Please try again.' });
    }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Error fetching quizzes", error: error.message });
    }
};
