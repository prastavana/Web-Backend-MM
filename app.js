const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db"); // Assuming you have a DB connection utility
const AuthRouter = require("./routes/authRoutes"); // Your authentication routes
const protectedRouter = require("./routes/protectedRoutes"); // Protected routes
const uploadMiddleware = require('./middleware/uploadMiddleware'); // If you're handling file uploads
const songController = require("./controllers/songController"); // If you have a song controller for handling song requests

const app = express();

// Connect to MongoDB
connectDb();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL for your app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json());

// Authentication and Protected Routes
app.use("/api/auth", AuthRouter); // Route for authentication
app.use("/api/protected", protectedRouter); // Protected route (possibly requiring authentication)

// Song Routes (assuming you want to handle song uploads)
app.post('/api/songs/add-chord', uploadMiddleware.fields([{ name: 'docxFile' }, { name: 'chordDiagrams', maxCount: 10 }]), songController.addSong);

// Serve static files (uploads folder for files like DOCX, images)
app.use('/uploads', express.static('uploads'));

// Handle other routes or fallback (for 404 errors)
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
