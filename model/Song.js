const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    selectedInstrument: { type: String, required: true },
    lyrics: [
        {
            section: String,
            lyrics: String, // Store lyrics as text
            parsedDocxFile: String // Store parsed DOCX content here
        }
    ],
    chordDiagrams: [String],
    docxFiles: [String] // Store the DOCX file paths
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
