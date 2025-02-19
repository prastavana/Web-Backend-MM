const multer = require("multer");
const path = require("path");

// Set up storage for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

// Create the multer instance
const profileUpload = multer({ storage }).single("profilePicture"); // Expect a single file with the field name 'profilePicture'

module.exports = profileUpload;