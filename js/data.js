const FLASHCARDS_DATA = [
    {
        id: 1,
        category: "greetings",
        en: "Hello",
        hi: "नमस्ते",
        mr: "नमस्कार",
        phonetic_hi: "Namaste",
        phonetic_mr: "Namaskar"
    },
    {
        id: 2,
        category: "greetings",
        en: "Thank You",
        hi: "धन्यवाद",
        mr: "धन्यवाद",
        phonetic_hi: "Dhanyavaad",
        phonetic_mr: "Dhanyavaad"
    },
    {
        id: 3,
        category: "travel",
        en: "How much does this cost?",
        hi: "यह कितने का है?",
        mr: "हे कितीला आहे?",
        phonetic_hi: "Yeh kitne ka hai?",
        phonetic_mr: "He kitila aahe?"
    },
    {
        id: 4,
        category: "travel",
        en: "Where is the station?",
        hi: "स्टेशन कहाँ है?",
        mr: "स्टेशन कुठे आहे?",
        phonetic_hi: "Station kahaan hai?",
        phonetic_mr: "Station kuthe aahe?"
    }
];

const CHAT_SCENARIOS = {
    market: {
        title: "Local Market (Sabzi Mandi)",
        steps: [
            {
                botText: { en: "Hello! What vegetables do you want to buy today?", hi: "नमस्ते! आज आप कौन सी सब्ज़ियां खरीदना चाहते हैं?", mr: "नमस्कार! आज तुम्हाला कोणत्या भाज्या हव्या आहेत?" },
                replies: [
                    {
                        text: { en: "How much are the tomatoes?", hi: "टमाटर कैसे दिए?", mr: "टोमॅटो कसे दिले?" },
                        tokens: [
                            { word: "टमाटर / टोमॅटो", translation: "Tomatoes" },
                            { word: "कैसे दिए / कसे दिले", translation: "How much?" }
                        ],
                        nextStep: 1
                    }
                ]
            },
            {
                botText: { en: "Tomatoes are 40 Rupees per kg.", hi: "टमाटर 40 रुपये किलो हैं।", mr: "टोमॅटो ४० रुपये किलो आहेत." },
                replies: [
                    {
                        text: { en: "Give me 1 kg please.", hi: "1 किलो दे दीजिए।", mr: "१ किलो द्या." },
                        tokens: [
                            { word: "1 किलो", translation: "1 kg" },
                            { word: "दे दीजिए / द्या", translation: "Please give" }
                        ],
                        nextStep: 2
                    }
                ]
            },
            {
                botText: { en: "Here you go! Anything else?", hi: "यह लीजिए! कुछ और चाहिए?", mr: "हे घ्या! अजून काही हवे आहे का?" },
                replies: []
            }
        ]
    }
};

const QUIZ_DATA = [
    {
        question: { en: "What is 'Thank You' in Hindi?", hi: "'Thank You' को हिंदी में क्या कहते हैं?", mr: "'Thank You' ला हिंदीमध्ये काय म्हणतात?" },
        options: ["धन्यवाद (Dhanyavaad)", "नमस्ते (Namaste)", "हाँ (Haan)", "नहीं (Nahin)"],
        correctIndex: 0
    },
    {
        question: { en: "What is 'Where is the station?' in Marathi?", hi: "'Where is the station?' को मराठी में क्या कहते हैं?", mr: "'Where is the station?' ला मराठीत काय म्हणतात?" },
        options: ["स्टेशन कुठे आहे?", "हे कितीला आहे?", "नमस्कार", "मला भूक लागली आहे"],
        correctIndex: 0
    }
];