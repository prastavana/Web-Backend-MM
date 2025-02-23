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
const toggleFavoriteSong = async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the token
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ error: "Song ID is required" });
    }

    try {
        // Find or create favorites entry for the user
        let favorite = await Favorite.findOne({ userId });
        if (!favorite) {
            favorite = new Favorite({ userId, songIds: [], lessonIds: [] });
        }

        // Toggle the songId in the favorites
        if (favorite.songIds.includes(songId)) {
            favorite.songIds = favorite.songIds.filter(id => id !== songId); // Remove from favorites
        } else {
            favorite.songIds.push(songId); // Add to favorites
        }

        await favorite.save();
        res.status(200).json({ message: "Favorite toggled successfully", favorite });
    } catch (error) {
        console.error("Error toggling favorite:", error); // Log the error for debugging
        res.status(500).json({ error: "Failed to toggle favorite" });
    }
};


// Export the toggleFavoriteSong function
exports.toggleFavoriteSong = toggleFavoriteSong; // Add this line
