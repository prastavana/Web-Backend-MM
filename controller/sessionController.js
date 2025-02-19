const Session = require('../model/Session');

// Add a new practice session
exports.createSession = async (req, res) => {
    try {
        const { instrument, day, title, description, duration, instructions } = req.body;

        // Validate if required fields are provided
        if (!instrument || !day || !title || !description || !duration || !instructions) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Handle file upload if exists
        let fileUrl = null;
        if (req.file) {
            // Assuming you're saving the file on the server or using cloud storage
            fileUrl = req.file.path; // Adjust this for your file upload method
        }

        const newSession = new Session({
            instrument,
            day,
            title,
            description,
            duration,
            instructions,
            file: fileUrl // Save file URL
        });

        const savedSession = await newSession.save();
        return res.status(201).json({ message: 'Practice session added successfully', session: savedSession });
    } catch (err) {
        return res.status(500).json({ error: 'An error occurred while creating the session' });
    }
};

// Get all practice sessions
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        return res.status(200).json(sessions);
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching sessions' });
    }
};
