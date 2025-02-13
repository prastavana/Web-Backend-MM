// controllers/songController.js

const Song = require('../models/song');
const mammoth = require('mammoth');
const path = require('path');

// Function to parse DOCX file
const parseDocx = (filePath) => {
    return mammoth.extractRawText({ path: filePath })
        .then(result => result.value)
        .catch(err => console.error('Error parsing DOCX file:', err));
};

// Add song route handler
const addSong = async (req, res) => {
    try {
        const { songName, selectedInstrument, lyrics } = req.body;

        // Handle uploaded DOCX file
        const docxFile = req.files['docxFile'] ? req.files['docxFile'][0].path : null;

        // Parse the DOCX file if it's uploaded
        let lyricsFromDocx = [];
        if (docxFile) {
            const docxText = await parseDocx(docxFile);
            lyricsFromDocx = parseLyricsFromText(docxText);
        }

        // Handle uploaded chord diagrams
        const chordDiagrams = req.files['chordDiagrams'] ? req.files['chordDiagrams'].map(file => file.path) : [];

        // Create the song object
        const song = new Song({
            songName,
            selectedInstrument,
            lyrics: lyricsFromDocx.length ? lyricsFromDocx : JSON.parse(lyrics), // If DOCX lyrics are parsed, use them; otherwise use submitted lyrics
            docxFile,
            chordDiagrams,
        });

        // Save song to database
        await song.save();
        res.status(201).json({ message: 'Song added successfully!', song });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ message: 'Error adding song', error });
    }
};

// Parse the DOCX text into lyrics and chords (simplified example)
const parseLyricsFromText = (text) => {
    const lines = text.split("\n");
    const parsedLyrics = [];
    lines.forEach(line => {
        const parts = line.split(":");
        if (parts.length === 2) {
            const [section, rest] = parts;
            const [lyric, chord] = rest.split(" ");
            parsedLyrics.push({ section, lyric, chord });
        }
    });
    return parsedLyrics;
};

module.exports = {
    addSong,
};
