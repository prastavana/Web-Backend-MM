// models/Song.js

const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    selectedInstrument: { type: String, default: "ukulele" },
    lyrics: [
        {
            section: { type: String, required: true },
            lyric: { type: String, required: true },
            chord: { type: String, required: true },
        },
    ],
    docxFile: { type: String }, // Path to the uploaded DOCX file
    chordDiagrams: [String], // Array of file paths for chord diagrams
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
