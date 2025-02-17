const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    instrument: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    file: {
        type: String, // This can store the URL to the uploaded file
        default: null,
    },
}, { timestamps: true });

const Session = mongoose.model('PracticeSession', practiceSessionSchema);

module.exports = Session;
