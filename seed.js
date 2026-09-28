require('dotenv').config();
const { connectDB, Lesson } = require('./database');

const seedData = async () => {
    await connectDB();
    await Lesson.deleteMany({}); // Purana data clean karein

    await Lesson.create([
        {
            title: "Basic Greetings",
            targetLang: "Hindi",
            level: "Beginner",
            order: 1,
            cards: [
                { type: "vocabulary", prompt: "Hello", translation: "नमस्ते (Namaste)" },
                { type: "quiz", prompt: "Translate 'Thank you'", options: ["धन्यवाद (Dhanyavaad)", "नमस्ते (Namaste)", "हाँ (Haan)"], answer: "धन्यवाद (Dhanyavaad)" }
            ]
        },
        {
            title: "Common Phrases",
            targetLang: "Hindi",
            level: "Beginner",
            order: 2,
            cards: [
                { type: "vocabulary", prompt: "How are you?", translation: "आप कैसे हैं? (Aap kaise hain?)" }
            ]
        }
    ]);

    console.log("Sample Lessons Added!");
    process.exit();
};

seedData();