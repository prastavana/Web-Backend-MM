const Session = require('../model/Session');

// Add a new practice session
exports.createSession = async (req, res) => {
    try {
        console.log(req.body); // Log the request body to see if mediaUrl is included
        const { instrument, day, title, description, duration, instructions, mediaUrl } = req.body;

        if (!instrument || !day || !title || !description || !duration || !instructions) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Determine file URL: uploaded file or YouTube URL
        let fileUrl = null;
        if (req.file) {
            fileUrl = req.file.path; // Store uploaded file path
        } else if (mediaUrl) {
            fileUrl = mediaUrl; // Store YouTube URL
        }

        const newSession = new Session({
            instrument,
            day,
            title,
            description,
            duration,
            instructions,
            file: fileUrl // Store file or YouTube URL
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
