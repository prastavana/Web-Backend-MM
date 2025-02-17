const mammoth = require('mammoth');

const parseDocxText = async (filePath) => {
    try {
        console.log(`Processing file: ${filePath}`);
        const result = await mammoth.extractRawText({ path: filePath });
        const extractedText = result.value.trim();

        if (!extractedText) {
            console.log("No text found in DOCX");
            return []; // Return an empty array if no content
        }

        console.log("Extracted Text:", extractedText);
        return parseDocxTextToLyrics(extractedText);
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        throw error;
    }
};

const parseDocxTextToLyrics = (text) => {
    const lines = text.split("\n").map(line => line.replace(/\r/g, '').trim());
    const parsedLyrics = [];
    let currentSection = 'Verse';
    let currentLyricsBlock = [];

    lines.forEach((line) => {
        if (!line.trim()) return;

        const sectionMatch = line.match(/^(Verse|Chorus|Intro|Bridge|Outro|Pre-Chorus|Solo)(\s*\d*)$/i);
        if (sectionMatch) {
            if (currentLyricsBlock.length) {
                parsedLyrics.push({ section: currentSection, lyrics: currentLyricsBlock.join("\n") });
            }
            currentSection = sectionMatch[1].trim();
            currentLyricsBlock = [];
            return;
        }

        currentLyricsBlock.push(line);
    });

    if (currentLyricsBlock.length) {
        parsedLyrics.push({ section: currentSection, lyrics: currentLyricsBlock.join("\n") });
    }

    console.log("Parsed lyrics:", JSON.stringify(parsedLyrics, null, 2)); // ✅ Logs correctly formatted JSON
    return parsedLyrics;
};

module.exports = parseDocxText;
