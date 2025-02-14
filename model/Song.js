// models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    songName: {
        type: String,
        required: true,
    },
    selectedInstrument: {
        type: String,
        required: true,
        enum: ['ukulele', 'guitar', 'piano'],
    },
    lyrics: [
        {
            section: { type: String, required: true },
            lyric: { type: String, required: true },
            chord: { type: String, required: true },
        },
    ],
    chordDiagrams: [
        {
            type: String, // path to the image file
        },
    ],
    docxFile: {
        type: String, // path to the DOCX file
    },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
