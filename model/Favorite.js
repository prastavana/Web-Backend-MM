const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming you have a User model
    },
    songIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song', // Assuming you have a Song model
    }],
    lessonIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson', // Assuming you have a Lesson model
    }]
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
