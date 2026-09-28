// --- Global State & Data References ---
let allLessons = [];
let currentLessonQuestions = [];
let currentQIndex = 0;
let lessonScore = 0;

// API se saare lessons fetch karein
async function fetchAllLessons() {
    try {
        const response = await fetch('/api/lessons');
        allLessons = await response.json();
        console.log("Lessons loaded successfully:", allLessons);
    } catch (err) {
        console.error("Failed to load lessons:", err);
    }
}

// User jab kisi level (Beginner/Inter/Adv) par click kare
function selectLevel(levelName) {
    const levelsView = document.getElementById('levels-view');
    const lessonsListView = document.getElementById('lessons-list-view');
    const levelTitle = document.getElementById('current-level-title');
    const container = document.getElementById('lessons-list');

    if (levelsView) levelsView.classList.add('hidden');
    if (lessonsListView) lessonsListView.classList.remove('hidden');
    if (levelTitle) levelTitle.textContent = `${levelName} Lessons`;

    // Case-insensitive filtering
    const filtered = allLessons.filter(l => 
        l.level && l.level.toLowerCase() === levelName.toLowerCase()
    );

    if (!container) return;

    if (!filtered || filtered.length === 0) {
        container.innerHTML = `<p style="padding: 1rem;">No lessons available for ${levelName} yet.</p>`;
        return;
    }

    container.innerHTML = filtered.map(lesson => `
        <div class="lesson-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 0.8rem;">
            <div>
                <h4 style="margin: 0;">${lesson.title}</h4>
                <p style="margin: 0.3rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">${lesson.description || ''}</p>
            </div>
            <button class="btn btn-primary" onclick="startLesson(${lesson.id})">
                <i class="fa-solid fa-play"></i> Start
            </button>
        </div>
    `).join('');
}

// Back button handler
function showLevelSelector() {
    const lessonsListView = document.getElementById('lessons-list-view');
    const levelsView = document.getElementById('levels-view');
    if (lessonsListView) lessonsListView.classList.add('hidden');
    if (levelsView) levelsView.classList.remove('hidden');
}

// Interactive Lesson Start Handler
function startLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.questions || lesson.questions.length === 0) {
        alert("Is lesson me questions nahi hain.");
        return;
    }

    currentLessonQuestions = lesson.questions;
    currentQIndex = 0;
    lessonScore = 0;

    const lessonsListView = document.getElementById('lessons-list-view');
    const quizView = document.getElementById('lesson-quiz-view');

    if (lessonsListView) lessonsListView.classList.add('hidden');
    if (quizView) quizView.classList.remove('hidden');

    renderLessonQuestion();
}

// Question Screen Render Logic
function renderLessonQuestion() {
    const q = currentLessonQuestions[currentQIndex];
    const targetLang = (typeof state !== 'undefined' && state.targetLang) ? state.targetLang : 'mr';
    
    const questionText = (q.question && q.question[targetLang]) 
        ? q.question[targetLang] 
        : (q.question['mr'] || q.question['hi'] || "Question");

    const qTextEl = document.getElementById('lesson-quiz-question');
    const qProgressEl = document.getElementById('lesson-quiz-progress');
    const feedbackEl = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-lesson-q-btn');
    const optionsGrid = document.getElementById('lesson-quiz-options');

    if (qTextEl) qTextEl.textContent = questionText;
    if (qProgressEl) qProgressEl.textContent = `Question ${currentQIndex + 1} of ${currentLessonQuestions.length}`;
    if (feedbackEl) feedbackEl.textContent = '';
    if (nextBtn) nextBtn.classList.add('hidden');

    if (optionsGrid) {
        optionsGrid.innerHTML = '';
        q.options.forEach((optionText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = optionText;
            btn.onclick = () => checkLessonAnswer(index, q.correctIndex, btn);
            optionsGrid.appendChild(btn);
        });
    }
}

// Answer Check Logic
function checkLessonAnswer(selectedIndex, correctIndex, selectedBtn) {
    const allBtns = document.querySelectorAll('#lesson-quiz-options .option-btn');
    allBtns.forEach(btn => btn.disabled = true);

    const feedbackEl = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-lesson-q-btn');

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        if (feedbackEl) {
            feedbackEl.textContent = "🎉 Sahi Jawab! (Correct)";
            feedbackEl.style.color = "var(--success-color)";
        }
        if (typeof audioEngine !== 'undefined') audioEngine.playCorrect();
        lessonScore += 10;
        if (typeof state !== 'undefined' && state.addXp) state.addXp(10);
        if (typeof updateStatsDisplay === 'function') updateStatsDisplay();
    } else {
        selectedBtn.classList.add('incorrect');
        if (allBtns[correctIndex]) allBtns[correctIndex].classList.add('correct');
        if (feedbackEl) {
            feedbackEl.textContent = "❌ Galat Jawab! Sahi option highlighted hai.";
            feedbackEl.style.color = "var(--danger-color)";
        }
        if (typeof audioEngine !== 'undefined') audioEngine.playIncorrect();
    }

    if (nextBtn) nextBtn.classList.remove('hidden');
}

// Next Question Handler
function nextLessonQuestion() {
    currentQIndex++;
    if (currentQIndex < currentLessonQuestions.length) {
        renderLessonQuestion();
    } else {
        const qTextEl = document.getElementById('lesson-quiz-question');
        const optionsGrid = document.getElementById('lesson-quiz-options');
        const feedbackEl = document.getElementById('feedback-message');
        const nextBtn = document.getElementById('next-lesson-q-btn');

        if (qTextEl) qTextEl.textContent = `🏆 Lesson Complete! Total Score: ${lessonScore} XP`;
        if (optionsGrid) optionsGrid.innerHTML = '';
        if (feedbackEl) feedbackEl.textContent = 'Well Done!';
        if (nextBtn) nextBtn.classList.add('hidden');
    }
}

// Quiz Exit Button
function exitLessonQuiz() {
    const quizView = document.getElementById('lesson-quiz-view');
    const lessonsListView = document.getElementById('lessons-list-view');
    if (quizView) quizView.classList.add('hidden');
    if (lessonsListView) lessonsListView.classList.remove('hidden');
}

// Attach Functions to Window for HTML Inline Onclick Attributes
window.selectLevel = selectLevel;
window.showLevelSelector = showLevelSelector;
window.startLesson = startLesson;
window.nextLessonQuestion = nextLessonQuestion;
window.exitLessonQuiz = exitLessonQuiz;

// Initialize Main DOM Events
document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const baseLangSelect = document.getElementById('base-lang');
    const targetLangSelect = document.getElementById('target-lang');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-section');
    const streakCount = document.getElementById('streak-count');
    const xpCount = document.getElementById('xp-count');

    // --- State Initialization ---
    if (typeof state !== 'undefined') {
        if (state.theme) document.documentElement.setAttribute('data-theme', state.theme);
        if (baseLangSelect && state.baseLang) baseLangSelect.value = state.baseLang;
        if (targetLangSelect && state.targetLang) targetLangSelect.value = state.targetLang;
    }
    updateStatsDisplay();

    // --- Localization Engine ---
    function updateTranslations() {
        if (typeof state === 'undefined' || typeof LOCALES === 'undefined') return;
        const lang = state.baseLang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (LOCALES[lang] && LOCALES[lang][key]) {
                el.textContent = LOCALES[lang][key];
            }
        });
    }
    updateTranslations();

    function updateStatsDisplay() {
        if (typeof state === 'undefined') return;
        if (streakCount) streakCount.textContent = state.streak;
        if (xpCount) xpCount.textContent = state.xp;
    }
    window.updateStatsDisplay = updateStatsDisplay;

    // --- Event Listeners: Preferences ---
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (typeof state === 'undefined') return;
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            state.setTheme(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    }

    if (baseLangSelect) {
        baseLangSelect.addEventListener('change', (e) => {
            if (typeof state === 'undefined') return;
            state.setBaseLang(e.target.value);
            updateTranslations();
            renderCard();
        });
    }

    if (targetLangSelect) {
        targetLangSelect.addEventListener('change', (e) => {
            if (typeof state === 'undefined') return;
            state.setTargetLang(e.target.value);
            renderCard();
        });
    }

    // --- Tabs Switcher ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            btn.classList.add('active');
            const targetView = document.getElementById(`view-${btn.dataset.tab}`);
            if (targetView) targetView.classList.add('active');
        });
    });

    // Fetch All Lessons Initial Call
    fetchAllLessons();

    // --- Flashcards Logic ---
    let cardIndex = 0;
    let filteredCards = (typeof state !== 'undefined' && state.getAllCards) ? state.getAllCards() : [];
    const flashcardEl = document.getElementById('flashcard');
    const frontText = document.getElementById('card-front-text');
    const backText = document.getElementById('card-back-text');
    const phoneticText = document.getElementById('card-phonetic');
    const cardProgress = document.getElementById('card-progress');

    function renderCard() {
        if (!filteredCards || filteredCards.length === 0) return;
        const currentCard = filteredCards[cardIndex];
        if (frontText) frontText.textContent = currentCard[state.baseLang] || currentCard.en;
        if (backText) backText.textContent = currentCard[state.targetLang] || currentCard.hi;
        if (phoneticText) phoneticText.textContent = currentCard[`phonetic_${state.targetLang}`] || '';
        if (cardProgress) cardProgress.textContent = `${cardIndex + 1} / ${filteredCards.length}`;
        if (flashcardEl) flashcardEl.classList.remove('flipped');
    }

    if (flashcardEl) {
        flashcardEl.addEventListener('click', () => {
            flashcardEl.classList.toggle('flipped');
        });
    }

    const nextCardBtn = document.getElementById('next-card-btn');
    if (nextCardBtn) {
        nextCardBtn.addEventListener('click', () => {
            if (cardIndex < filteredCards.length - 1) { cardIndex++; renderCard(); }
        });
    }

    const prevCardBtn = document.getElementById('prev-card-btn');
    if (prevCardBtn) {
        prevCardBtn.addEventListener('click', () => {
            if (cardIndex > 0) { cardIndex--; renderCard(); }
        });
    }

    const cardAudioBtn = document.getElementById('card-audio-btn');
    if (cardAudioBtn) {
        cardAudioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (filteredCards.length === 0) return;
            const currentCard = filteredCards[cardIndex];
            if (typeof audioEngine !== 'undefined') {
                audioEngine.speak(currentCard[state.targetLang], state.targetLang);
            }
        });
    }

    // Custom Card Addition
    const addCardBtn = document.getElementById('add-card-btn');
    if (addCardBtn) {
        addCardBtn.addEventListener('click', () => {
            const frontVal = document.getElementById('custom-front').value;
            const backVal = document.getElementById('custom-back').value;
            const phoneticVal = document.getElementById('custom-phonetic').value;

            if (frontVal && backVal && typeof state !== 'undefined') {
                const newCard = {
                    id: Date.now(),
                    category: "custom",
                    [state.baseLang]: frontVal,
                    [state.targetLang]: backVal,
                    [`phonetic_${state.targetLang}`]: phoneticVal
                };
                state.addCustomCard(newCard);
                filteredCards = state.getAllCards();
                renderCard();
                document.getElementById('custom-front').value = '';
                document.getElementById('custom-back').value = '';
                document.getElementById('custom-phonetic').value = '';
            }
        });
    }

    // --- AI Chat Buddy Logic ---
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');

    function appendMessage(text, sender) {
        if (!chatMessagesContainer) return null;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${sender}-bubble`;
        msgDiv.textContent = text;
        
        chatMessagesContainer.appendChild(msgDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        return msgDiv;
    }

    async function handleSendMessage() {
        if (!chatInput) return;
        
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage(userText, 'user');
        chatInput.value = '';

        const typingIndicator = appendMessage('AI Buddy is thinking...', 'bot');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    targetLang: (typeof state !== 'undefined' && state.targetLang) ? state.targetLang : 'hi'
                })
            });

            const data = await response.json();
            if (typingIndicator) typingIndicator.remove();

            if (data.reply) {
                appendMessage(data.reply, 'bot');
                if (typeof state !== 'undefined' && state.addXp) {
                    state.addXp(5);
                    updateStatsDisplay();
                }
            } else {
                appendMessage("Response receive nahi hua.", 'bot');
            }
        } catch (err) {
            if (typingIndicator) typingIndicator.remove();
            console.error("Chat Error:", err);
            appendMessage("Server connection error. Please check backend.", 'bot');
        }
    }

    if (sendChatBtn) sendChatBtn.onclick = handleSendMessage;
    if (chatInput) {
        chatInput.onkeydown = (e) => {
            if (e.key === 'Enter') handleSendMessage();
        };
    }

    // --- Quiz Logic ---
    let quizIdx = 0;
    let quizScore = 0;

    function renderQuiz() {
        if (typeof QUIZ_DATA === 'undefined' || !QUIZ_DATA[quizIdx]) return;
        const q = QUIZ_DATA[quizIdx];

        const qEl = document.getElementById('quiz-question');
        const qProgEl = document.getElementById('quiz-progress');
        const qScoreEl = document.getElementById('quiz-score');

        if (qEl) qEl.textContent = q.question[state.baseLang] || q.question.en;
        if (qProgEl) qProgEl.textContent = `Question ${quizIdx + 1} of ${QUIZ_DATA.length}`;
        if (qScoreEl) qScoreEl.textContent = `Score: ${quizScore}`;

        const optionsGrid = document.getElementById('quiz-options');
        if (!optionsGrid) return;
        optionsGrid.innerHTML = '';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                const buttons = optionsGrid.querySelectorAll('.option-btn');
                buttons.forEach(b => b.disabled = true);

                if (idx === q.correctIndex) {
                    btn.classList.add('correct');
                    if (typeof audioEngine !== 'undefined') audioEngine.playCorrect();
                    quizScore += 10;
                    if (typeof state !== 'undefined' && state.addXp) state.addXp(10);
                    updateStatsDisplay();
                } else {
                    btn.classList.add('incorrect');
                    if (buttons[q.correctIndex]) buttons[q.correctIndex].classList.add('correct');
                    if (typeof audioEngine !== 'undefined') audioEngine.playIncorrect();
                }
                const nextQuizBtn = document.getElementById('next-quiz-btn');
                if (nextQuizBtn) nextQuizBtn.classList.remove('hidden');
            });
            optionsGrid.appendChild(btn);
        });
    }

    const nextQuizBtn = document.getElementById('next-quiz-btn');
    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
            quizIdx++;
            nextQuizBtn.classList.add('hidden');
            if (typeof QUIZ_DATA !== 'undefined' && quizIdx < QUIZ_DATA.length) {
                renderQuiz();
            } else {
                const qEl = document.getElementById('quiz-question');
                const optGrid = document.getElementById('quiz-options');
                if (qEl) qEl.textContent = `Quiz Complete! Final Score: ${quizScore}`;
                if (optGrid) optGrid.innerHTML = '';
            }
        });
    }

    // Initial Renders
    renderCard();
    renderQuiz();
});

// ==========================================
// AUTHENTICATION & AUTO-POPUP LOGIN LOGIC
// ==========================================

// DOM Content Load hone par Auth listeners attach honge
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const openLoginBtn = document.getElementById('open-login-btn');
    const closeAuthModal = document.getElementById('close-auth-modal');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userProfileBadge = document.getElementById('user-profile-badge');
    const userDisplayName = document.getElementById('user-display-name');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Check User State & Auto-Open Modal if Not Logged In
    function checkAuthState() {
        const savedUser = JSON.parse(localStorage.getItem('bhasha_user'));

        if (savedUser && savedUser.name) {
            // User Logged In hai -> Modal Hide karein aur Profile Badge dikhaiye
            if (authModal) authModal.classList.add('hidden');
            if (openLoginBtn) openLoginBtn.classList.add('hidden');
            if (userProfileBadge) userProfileBadge.classList.remove('hidden');
            if (userDisplayName) userDisplayName.textContent = savedUser.name;
        } else {
            // User Logged In Nahi hai -> App open hote hi LOGIN POPUP show karein
            if (authModal) authModal.classList.remove('hidden');
            if (openLoginBtn) openLoginBtn.classList.remove('hidden');
            if (userProfileBadge) userProfileBadge.classList.add('hidden');
        }
    }

    // Initial check on page load
    checkAuthState();

    // 2. Open / Close Event Listeners
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.remove('hidden');
        });
    }

    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            if (authModal) authModal.classList.add('hidden');
        });
    }

    // 3. Tab Switchers (Login <-> Register)
    if (tabLoginBtn && tabRegisterBtn && loginForm && registerForm) {
        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabRegisterBtn.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });

        tabRegisterBtn.addEventListener('click', () => {
            tabRegisterBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }

    // 4. Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value : 'User';
            const name = email.split('@')[0];
            const user = { email, name: name.charAt(0).toUpperCase() + name.slice(1) };

            localStorage.setItem('bhasha_user', JSON.stringify(user));
            checkAuthState();
        });
    }

    // 5. Register Form Submit
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('reg-name');
            const emailInput = document.getElementById('reg-email');
            const name = nameInput ? nameInput.value : 'User';
            const email = emailInput ? emailInput.value : '';

            const user = { name, email };
            localStorage.setItem('bhasha_user', JSON.stringify(user));
            checkAuthState();
        });
    }

    // 6. Logout Button Click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('bhasha_user');
            checkAuthState();
        });
    }
});