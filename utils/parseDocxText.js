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

const parseDocxTextToLyrics = (text) => {
    const lines = text.split("\n");
    const parsedLyrics = [];
    let currentChords = [];
    let currentLyrics = '';
    let currentSection = '';

    lines.forEach((line) => {
        const sectionMatch = line.match(/^(Verse|Chorus|Intro|Bridge)\s*(\d*)/i); // Detect sections like "Verse 1", "Chorus", etc.

        if (sectionMatch) {
            if (currentChords.length > 0 && currentLyrics.trim()) {
                parsedLyrics.push({
                    section: currentSection || "Unknown",
                    chords: currentChords,
                    lyrics: currentLyrics
                });
            }
            currentSection = sectionMatch[0]; // Set the current section (e.g., "Verse 1")
            currentChords = [];
            currentLyrics = '';
        }

        const chordMatch = line.match(/^([A-G][#b]?m?(?:\s[A-G][#b]?m?)*)/);

        if (chordMatch) {
            if (currentChords.length > 0 && currentLyrics.trim()) {
                parsedLyrics.push({ section: currentSection || "Unknown", chords: currentChords, lyrics: currentLyrics });
            }
            currentChords = chordMatch[0].split(' ').filter(Boolean);
            currentLyrics = line.replace(chordMatch[0], "").trim();
        } else {
            currentLyrics += (currentLyrics ? "\n" : "") + line.trim();
        }
    });

    if (currentChords.length > 0 && currentLyrics.trim()) {
        parsedLyrics.push({ section: currentSection || "Unknown", chords: currentChords, lyrics: currentLyrics });
    }

    return parsedLyrics;
};




module.exports = parseDocxText;
