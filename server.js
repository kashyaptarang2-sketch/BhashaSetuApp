// const { connectDB, Lesson } = require('./database');

// connectDB();


// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const { GoogleGenAI } = require('@google/genai');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware setup
// app.use(express.json());
// app.use(express.static(path.join(__dirname)));

// // API Key initialization with fallback check
// const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
// if (!apiKey) {
//     console.warn("WARNING: No API Key found in .env file!");
// }

// const ai = new GoogleGenAI({ apiKey: apiKey });

// // AI Chat Route
// app.post('/api/chat', async (req, res) => {
//     try {
//         const { message, targetLang } = req.body;
//         if (!message) {
//             return res.status(400).json({ error: "Message is required" });
//         }

//         const systemPrompt = `You are a friendly language tutor in BhashaSetu app. Target Language: ${targetLang || 'Hindi'}. Keep answers short (1-2 sentences).`;

//         // Model name updated to gemini-3.6-flash
//         const response = await ai.models.generateContent({
//             model: 'gemini-3.6-flash',
//             contents: `${systemPrompt}\n\nUser: ${message}`,
//         });

//         res.json({ reply: response.text });
//     } catch (error) {
//         console.error("AI Error Details:", error.message || error);
//         res.status(500).json({ error: "Failed to generate AI response", details: error.message });
//     }
// });

// // API Route 1: Saare Lessons Fetch Karna
// app.get('/api/lessons', async (req, res) => {
//     try {
//         const lessons = await Lesson.find().sort({ order: 1 });
//         res.json(lessons);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to fetch lessons" });
//     }
// });

// // API Route 2: Single Lesson Fetch Karna
// app.get('/api/lessons/:id', async (req, res) => {
//     try {
//         const lesson = await Lesson.findById(req.params.id);
//         if (!lesson) return res.status(404).json({ error: "Lesson not found" });
//         res.json(lesson);
//     } catch (err) {
//         res.status(500).json({ error: "Invalid Lesson ID" });
//     }
// });

// // HTML Catch-all Route
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Server Listen
// app.listen(PORT, () => {
//     console.log(`=================================`);
//     console.log(`Server running at http://localhost:${PORT}`);
//     console.log(`=================================`);
// });

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Key initialization
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("WARNING: No API Key found in .env file!");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper function to read lessons from lessons.json
function getLessonsData() {
    try {
        const filePath = path.join(__dirname, 'lessons.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading lessons.json:", err);
        return [];
    }
}

// AI Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message, targetLang } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const systemPrompt = `You are a friendly language tutor in BhashaSetu app. Target Language: ${targetLang || 'Hindi'}. Keep answers short (1-2 sentences).`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `${systemPrompt}\n\nUser: ${message}`,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("AI Error Details:", error.message || error);
        res.status(500).json({ error: "Failed to generate AI response", details: error.message });
    }
});

// API Route 1: JSON File se Saare Lessons Fetch Karna
app.get('/api/lessons', (req, res) => {
    const lessons = getLessonsData();
    res.json(lessons);
});

// API Route 2: JSON File se Single Lesson Fetch Karna
app.get('/api/lessons/:id', (req, res) => {
    const lessons = getLessonsData();
    const lesson = lessons.find(l => l.id == req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
});

// HTML Catch-all Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server Listen
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`=================================`);
});