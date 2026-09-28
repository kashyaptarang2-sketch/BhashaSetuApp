# BhashaSetu - Local Language Learning Web App

BhashaSetu is an interactive local language learning web platform designed to help users bridge communication gaps by mastering **Hindi**, **Marathi**, and **English**.

---

## 🌟 Key Features

* **Dynamic Language Switcher**: Set your base/interface language and learn target regional languages easily.
* **Interactive 3D Flashcards**: Flip cards to view translations, phonetic pronunciations, and category filters.
* **Native Speech Synthesis**: Built-in audio pronunciation for vocabulary using Web Speech API & Web Audio API.
* **AI Chat Buddy**: Practice real-world contextual scenarios (e.g., Local Market, Rickshaw Fare, Cafe) with interactive conversation trees and tokenized breakdowns.
* **Daily Quiz & Gamification**: Interactive quizzes, real-time scoring, sound effects, daily streak tracking, and XP points stored locally.
* **Custom Vocabulary Creator**: Add custom word pairs that persist across browser sessions.
* **Responsive Dark/Light Theme**: Sleek UI designed with custom CSS variables and full mobile responsiveness.

---

## 📁 Project Structure

```text
bhashasetu/
├── index.html          # Main HTML structure & layouts
├── server.js           # Node.js / Express static server
├── package.json        # Project metadata & dependencies
├── README.md           # Documentation & setup guide
├── css/
│   └── styles.css      # Custom styling, dark/light theme & animations
└── js/
    ├── locales.js      # UI Translation mappings (English, Hindi, Marathi)
    ├── data.js         # Vocabulary, Chat scenarios & Quiz data
    ├── audio.js        # Web Audio API sound effects & Text-to-Speech
    ├── state.js        # Dynamic LocalStorage state management
    └── app.js          # Core app controller & interactivity