const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const AuthRouter = require("./routes/authRoutes");
const protectedRouter = require("./routes/protectedRoutes");
const songRoutes = require("./routes/songRoutes"); // Add song routes
const uploadMiddleware = require('./middleware/uploadMiddleware');
const session = require("./routes/songRoutes");
const sessionRoutes = require('./routes/sessionRoutes');
const path = require("path"); // To serve static files for uploads
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
app.use("/api/auth", AuthRouter);
app.use("/api/protected", protectedRouter);
app.use('/api/sessions', sessionRoutes);


// Song Routes
app.use("/api/songs", songRoutes); // Make sure this is added

// Middleware for handling file uploads
app.use(uploadMiddleware);

// Serve static files (uploads folder for files like DOCX, images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle other routes or fallback
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
