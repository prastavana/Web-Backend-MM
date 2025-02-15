const Song = require('../model/Song');
const path = require('path');
const fs = require('fs');
const parseDocxText = require('../utils/parseDocxText');  // Import the parsing utility

// Handle the creation of a song
exports.createSong = async (req, res) => {
    try {
        const { songName, selectedInstrument } = req.body;
        let chordDiagrams = [];
        let docxFile = null;
        let lyrics = [];

        // Handle uploaded chord diagrams
        if (req.files && req.files.chordDiagrams) {
            chordDiagrams = req.files.chordDiagrams.map(file => file.path);
        }

        // Handle uploaded DOCX file and parse it
        if (req.files && req.files.docxFile) {
            docxFile = req.files.docxFile[0].path;

            // Parse DOCX file for lyrics and chords
            lyrics = await parseDocxText(docxFile);  // Get parsed lyrics from DOCX
        }

        // Create new song record
        const newSong = new Song({
            songName,
            selectedInstrument,
            lyrics,  // Store the parsed lyrics
            chordDiagrams,
            docxFile,
        });

        // Save to database
        await newSong.save();

        return res.status(200).json({ message: 'Song added successfully!', song: newSong });
    } catch (error) {
        console.error('Error creating song:', error);
        return res.status(500).json({ message: 'Error adding song' });
    }
};

// Fetch all songs from the database
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
exports.getSongById = async (req, res) => {
    try {
        const songId = req.params.id;  // Get the song ID from the URL parameter
        const song = await Song.findById(songId);  // Find the song by ID

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        return res.status(200).json(song);  // Return the song data
    } catch (error) {
        console.error('Error fetching song by ID:', error);
        return res.status(500).json({ message: 'Error fetching song details' });
    }
};
