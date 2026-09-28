class AppState {
    constructor() {
        this.baseLang = localStorage.getItem('bhasha_base') || 'en';
        this.targetLang = localStorage.getItem('bhasha_target') || 'hi';
        this.theme = localStorage.getItem('bhasha_theme') || 'light';
        this.streak = parseInt(localStorage.getItem('bhasha_streak')) || 1;
        this.xp = parseInt(localStorage.getItem('bhasha_xp')) || 0;
        
        const savedCustom = localStorage.getItem('bhasha_custom_cards');
        this.customCards = savedCustom ? JSON.parse(savedCustom) : [];
    }

    setBaseLang(lang) {
        this.baseLang = lang;
        localStorage.setItem('bhasha_base', lang);
    }

    setTargetLang(lang) {
        this.targetLang = lang;
        localStorage.setItem('bhasha_target', lang);
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('bhasha_theme', theme);
    }

    addXp(points) {
        this.xp += points;
        localStorage.setItem('bhasha_xp', this.xp);
    }

    addCustomCard(card) {
        this.customCards.push(card);
        localStorage.setItem('bhasha_custom_cards', JSON.stringify(this.customCards));
    }

    getAllCards() {
        return [...FLASHCARDS_DATA, ...this.customCards];
    }
}

const state = new AppState();