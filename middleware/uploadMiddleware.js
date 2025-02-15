const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');  // Save files to the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filenames
    },
});

const upload = multer({ storage }).fields([
    { name: 'chordDiagrams', maxCount: 10 },
    { name: 'docxFile', maxCount: 1 },
]);

module.exports = upload;