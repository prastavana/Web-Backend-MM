const Song = require("../model/Song");
const path = require('path');
const fs = require('fs');
const parseDocxText = require("../utils/parseDocxText");  // Ensure this utility function exists

// ✅ Create a new song with DOCX parsing
// ✅ Create a new song with DOCX parsing
// ✅ Create a new song with DOCX parsing
exports.createSong = async (req, res) => {
    try {
        const { songName, selectedInstrument, lyrics } = req.body;
        let chordDiagrams = [];

        // Parse lyrics as JSON
        let parsedLyrics;
        try {
            parsedLyrics = JSON.parse(lyrics);  // Parsing lyrics from JSON format
        } catch (err) {
            return res.status(400).json({ message: "Invalid lyrics format. Ensure JSON format." });
        }

        // Handle uploaded chord diagrams
        if (req.files?.chordDiagrams) {
            chordDiagrams = req.files.chordDiagrams.map(file => file.path);
        }

        // Handle DOCX parsing and update the filenames
        let docxText = [];
        let docxFiles = [];
        if (req.files?.docxFiles) {
            // Save the uploaded DOCX files with new names
            docxFiles = req.files.docxFiles.map(file => {
                const newFileName = file.filename; // Get the new file name
                const newFilePath = path.join('uploads', newFileName); // Construct relative file path
                console.log("DOCX File Path:", newFilePath);  // Debugging log
                return newFilePath;  // Return relative path to save in DB
            });

            // Parse each DOCX file and save its content to the lyrics array
            try {
                docxText = await Promise.all(docxFiles.map(async (filePath) => {
                    const parsedDoc = await parseDocxText(filePath);  // Make sure this utility returns text
                    // Ensure the parsed text is a string, or join it if it's an array
                    return Array.isArray(parsedDoc) ? parsedDoc.join('\n') : parsedDoc;
                }));
            } catch (error) {
                console.error("Error parsing DOCX files:", error);
                return res.status(500).json({ message: "Error parsing DOCX files" });
            }
        }

        // Combine DOCX parsed content with the original lyrics
        parsedLyrics.forEach((verse, index) => {
            if (docxText[index]) {
                // Ensure parsedDocxFile is always an array
                verse.parsedDocxFile = Array.isArray(docxText[index]) ? docxText[index] : [docxText[index]];
            }
        });

        // Create and save the new song with updated filenames
        const newSong = new Song({
            songName,
            selectedInstrument,
            lyrics: parsedLyrics, // Store lyrics with linked DOCX files
            chordDiagrams,
            docxFiles: docxFiles // Store the relative DOCX file paths
        });

        await newSong.save();
        return res.status(201).json({ message: "Song added successfully!", song: newSong });
    } catch (error) {
        console.error("Error creating song:", error);
        return res.status(500).json({ message: "Error adding song" });
    }
};


// ✅ Fetch a single song by ID
// ✅ Fetch a single song by ID
exports.getSongById = async (req, res) => {
    const songId = req.params.id;

    try {
        const song = await Song.findById(songId);  // Fetch the song

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Parse DOCX files and attach parsed content for each lyric section
        const lyricsWithParsedDocx = await Promise.all(song.lyrics.map(async (lyric, index) => {
            let parsedDocxFile = null;

            // Check if there's a corresponding DOCX file for each lyric
            if (song.docxFiles[index]) {
                const filePath = path.join(__dirname, '..', song.docxFiles[index]);

                // Check if the file exists before parsing
                if (fs.existsSync(filePath)) {
                    parsedDocxFile = await parseDocxText(filePath);
                    // Ensure parsedDocxFile is an array
                    parsedDocxFile = Array.isArray(parsedDocxFile) ? parsedDocxFile : [parsedDocxFile];
                } else {
                    console.warn(`DOCX file not found: ${filePath}`);
                }
            }

            return {
                section: lyric.section,
                lyrics: lyric.lyrics,
                parsedDocxFile: parsedDocxFile || []  // Ensure it's an empty array if no DOCX content
            };
        }));

        // Structure the song data
        const songResponse = {
            _id: song._id,
            songName: song.songName,
            selectedInstrument: song.selectedInstrument,
            chordDiagrams: song.chordDiagrams,
            lyrics: lyricsWithParsedDocx
        };

        res.json(songResponse);  // Send the structured song data

    } catch (error) {
        console.error("Error fetching song details:", error);
        res.status(500).json({ message: 'Error fetching song details' });
    }
};


// ✅ Update an existing song
exports.updateSong = async (req, res) => {
    try {
        const { songName, selectedInstrument, lyrics } = req.body;
        let parsedLyrics;
        try {
            parsedLyrics = JSON.parse(lyrics);
        } catch (err) {
            return res.status(400).json({ message: "Invalid lyrics format. Ensure JSON format." });
        }

        const updatedSong = await Song.findByIdAndUpdate(
            req.params.id,
            {
                songName,
                selectedInstrument,
                lyrics: parsedLyrics,
                chordDiagrams: req.files?.chordDiagrams ? req.files.chordDiagrams.map(file => file.path) : [],
                docxFiles: req.files?.docxFiles ? req.files.docxFiles.map(file => path.join('uploads', file.filename)) : []
            },
            { new: true }
        );

        if (!updatedSong) return res.status(404).json({ message: "Song not found" });

        return res.status(200).json({ message: "Song updated successfully!", song: updatedSong });
    } catch (error) {
        console.error("Error updating song:", error);
        return res.status(500).json({ message: "Error updating song" });
    }
};

// ✅ Fetch all songs, optionally filtered by instrument
exports.getAllSongs = async (req, res) => {
    try {
        const { instrument } = req.query;
        const songs = instrument ? await Song.find({ selectedInstrument: instrument }) : await Song.find();
        return res.status(200).json({ songs });
    } catch (error) {
        console.error("Error fetching songs:", error);
        return res.status(500).json({ message: "Error fetching songs" });
    }
};

// ✅ Parse DOCX file (Utility function)
exports.parseDocxFile = async (req, res) => {
    try {
        const docxFilePath = req.files.docxFile[0].path;
        const parsedText = await parseDocxText(docxFilePath);  // Ensure this function returns the DOCX content
        return res.json({ message: "DOCX file parsed successfully", parsedText });
    } catch (error) {
        console.error("Error parsing DOCX file:", error);
        return res.status(500).json({ message: "Error parsing DOCX file" });
    }
};
