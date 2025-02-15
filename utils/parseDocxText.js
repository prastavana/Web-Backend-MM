const mammoth = require('mammoth');

// Function to parse the DOCX file and extract text
const parseDocxText = (filePath) => {
    return new Promise((resolve, reject) => {
        mammoth.extractRawText({ path: filePath }) // Extract raw text from the DOCX file
            .then((result) => {
                const extractedText = result.value; // Get the raw text
                console.log("Extracted Text from DOCX:", extractedText); // Log for debugging
                const lyrics = parseDocxTextToLyrics(extractedText); // Parse the extracted text into structured data
                resolve(lyrics); // Return the parsed lyrics
            })
            .catch((err) => reject(err)); // Reject the promise if there is an error
    });
};

// Function to convert raw text into a structured format (lyrics and chords)
const parseDocxTextToLyrics = (text) => {
    const lines = text.split("\n"); // Split the raw text into lines
    const parsedLyrics = [];

    lines.forEach((line) => {
        // Match lines starting with a chord pattern, e.g., "G Em"
        const chordMatch = line.match(/^([A-Za-z#]+(?:\s[A-Za-z#]+)*)/);
        if (chordMatch) {
            // If the line starts with chords, extract them
            const chords = chordMatch[0].split(/\s+/); // Split chords by space
            const lyrics = line.replace(chordMatch[0], "").trim(); // Remove the chord part from the line
            parsedLyrics.push({ chords, lyrics }); // Add the parsed chord and lyric pair to the result
        } else {
            // If no chord pattern is found, treat the line as just lyrics
            parsedLyrics.push({ chords: [], lyrics: line.trim() }); // Add the line as a lyric with no chords
        }
    });

    return parsedLyrics; // Return the parsed lyrics and chords
};

module.exports = parseDocxText; // Export the function to be used elsewhere.
