const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Function to parse the DOCX file and extract text
const parseDocxText = (filePath) => {
    return new Promise((resolve, reject) => {
        mammoth.extractRawText({ path: filePath })
            .then((result) => {
                const extractedText = result.value.trim();  // Extract raw text and trim whitespace
                console.log("Extracted Text from DOCX:", extractedText);  // Log for debugging

                if (extractedText) {
                    const lyrics = parseDocxTextToLyrics(extractedText);
                    console.log("Parsed Lyrics:", lyrics);  // Log parsed lyrics
                    resolve(lyrics);  // If there is text, resolve with parsed lyrics
                } else {
                    console.log("No text found in DOCX");
                    resolve([]);  // Return an empty array if no text was found
                }
            })
            .catch((err) => {
                console.error("Error extracting text from DOCX:", err);
                reject(err);  // Reject the promise if there’s an error
            });
    });
};

// Function to convert raw text into a structured format (lyrics and chords)
const parseDocxTextToLyrics = (text) => {
    const lines = text.split("\n");  // Split the raw text into lines
    const parsedLyrics = [];

    let currentChords = [];
    let currentLyrics = '';

    lines.forEach((line) => {
        // Match lines starting with a chord pattern, e.g., "G Em"
        const chordMatch = line.match(/^([A-Za-z#]+(?:\s[A-Za-z#]+)*)/); // Match chords

        if (chordMatch) {
            // If a new chord pattern is found, push the existing chords and lyrics
            if (currentChords.length > 0 && currentLyrics.trim()) {
                parsedLyrics.push({ chords: currentChords, lyrics: currentLyrics });
            }
            // Update current chords and lyrics
            currentChords = chordMatch[0].split(' ').filter(Boolean); // Split chords by space
            currentLyrics = line.replace(chordMatch[0], "").trim(); // Remove the chords from lyrics
        } else {
            // If no chord pattern, continue with the current lyrics
            currentLyrics += (currentLyrics ? "\n" : "") + line.trim();
        }
    });

    // Push the final parsed lyrics and chords
    if (currentChords.length > 0 && currentLyrics.trim()) {
        parsedLyrics.push({ chords: currentChords, lyrics: currentLyrics });
    }

    return parsedLyrics;  // Return the parsed lyrics and chords
};

module.exports = { parseDocxText };  // Export the function to be used elsewhere
