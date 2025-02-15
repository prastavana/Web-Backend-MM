// controllers/songController.js
const Song = require('../model/Song');
const path = require('path');
const fs = require('fs');

// Handle the creation of a song
// In songController.js
const parseDocxText = require('../utils/parseDocxText');

exports.createSong = async (req, res) => {
    try {
        const { songName, selectedInstrument, lyrics } = req.body;
        let chordDiagrams = [];
        let docxFile = null;
        let docxText = null;

        // Handle uploaded chord diagrams
        if (req.files && req.files.chordDiagrams) {
            chordDiagrams = req.files.chordDiagrams.map(file => file.path);
        }

        // Handle uploaded DOCX file
        if (req.files && req.files.docxFile) {
            docxFile = req.files.docxFile[0].path;
            // Parse the DOCX file and extract text
            docxText = await parseDocxText(docxFile);  // Wait for DOCX parsing
            console.log("Parsed DOCX Text:", docxText);  // Log the parsed text
        }

        // Create new song record
        const newSong = new Song({
            songName,
            selectedInstrument,
            lyrics,
            chordDiagrams,
            docxFile,
            docxText,  // Save the parsed DOCX content
        });

        // Save to database
        await newSong.save();

        return res.status(200).json({ message: 'Song added successfully!', song: newSong });
    } catch (error) {
        console.error('Error creating song:', error);
        return res.status(500).json({ message: 'Error adding song' });
    }
};


// Handle parsing of DOCX file (utility function)
exports.parseDocxFile = (req, res) => {
    const docxFilePath = req.files.docxFile[0].path;
    // You can call your DOCX parsing utility here to extract lyrics from the DOCX file.
    res.json({ message: 'DOCX file parsed successfully', docxFilePath });
};

// Add this to your existing songController.js

// Fetch all songs from the database
// In songController.js

// Fetch all songs, optionally filtered by instrument
exports.getAllSongs = async (req, res) => {
    try {
        const instrument = req.query.instrument; // Get the instrument from query
        let songs;

        if (instrument) {
            songs = await Song.find({ selectedInstrument: instrument }); // Filter by instrument
        } else {
            songs = await Song.find(); // Fetch all songs
        }

        return res.status(200).json({ songs });
    } catch (error) {
        console.error('Error fetching songs:', error);
        return res.status(500).json({ message: 'Error fetching songs' });
    }
};
// Fetch a song by ID
// controllers/songController.js
exports.getSongById = async (req, res) => {
    try {
        const songId = req.params.id;  // Get the song ID from the URL parameter
        const song = await Song.findById(songId);  // Find the song by ID

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        return res.status(200).json(song);  // Return the song data, including parsed DOCX text
    } catch (error) {
        console.error('Error fetching song by ID:', error);
        return res.status(500).json({ message: 'Error fetching song details' });
    }
};
