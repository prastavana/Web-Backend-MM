// utils/parseDocxText.js
const mammoth = require('mammoth');

const parseDocxText = (filePath) => {
    return new Promise((resolve, reject) => {
        mammoth.extractRawText({ path: filePath })
            .then((result) => {
                const extractedText = result.value;
                const lyrics = parseDocxTextToLyrics(extractedText);
                resolve(lyrics);
            })
            .catch((err) => reject(err));
    });
};

const parseDocxTextToLyrics = (text) => {
    const lines = text.split("\n");
    const parsedLyrics = [];
    lines.forEach((line) => {
        const parts = line.split(":");
        if (parts.length === 2) {
            const [section, rest] = parts;
            const [lyric, chord] = rest.split(" ");
            parsedLyrics.push({ section, lyric, chord });
        }
    });
    return parsedLyrics;
};

module.exports = parseDocxText;
