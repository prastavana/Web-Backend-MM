const Favorite = require('../model/Favorite'); // Adjust the path as necessary

// Get favorite songs and lessons for a user
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        const favorites = await Favorite.findOne({ userId }).populate('songIds').populate('lessonIds');

        if (!favorites) {
            return res.status(404).json({ message: 'No favorites found' });
        }

        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add or remove a favorite song
exports.toggleFavoriteSong = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        const { songId } = req.body; // Expecting the songId in the request body

        let favorites = await Favorite.findOne({ userId });

        if (!favorites) {
            favorites = new Favorite({ userId, songIds: [], lessonIds: [] });
        }

        if (favorites.songIds.includes(songId)) {
            favorites.songIds.pull(songId); // Remove if already liked
        } else {
            favorites.songIds.push(songId); // Add if not already liked
        }

        await favorites.save();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add or remove a favorite lesson
exports.toggleFavoriteLesson = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user authentication middleware
        const { lessonId } = req.body; // Expecting the lessonId in the request body

        let favorites = await Favorite.findOne({ userId });

        if (!favorites) {
            favorites = new Favorite({ userId, songIds: [], lessonIds: [] });
        }

        if (favorites.lessonIds.includes(lessonId)) {
            favorites.lessonIds.pull(lessonId); // Remove if already liked
        } else {
            favorites.lessonIds.push(lessonId); // Add if not already liked
        }

        await favorites.save();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
