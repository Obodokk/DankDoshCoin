/**
 * Мультиязычность сайта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем переводы для текущего языка
    loadTranslations();
});

// Словари переводов
const translations = {
    ru: {
        'home': 'Главная',
        'lottery': 'Лотерея',
        'faq': 'FAQ',
        'about': 'О нас',
        'login': 'Войти',
        'register': 'Регистрация',
        'jackpot': 'Текущий джекпот',
        'next_draw': 'Следующий розыгрыш через',
        'days': 'дней',
        'hours': 'часов',
        'minutes': 'минут',
        'seconds': 'секунд',
        'winners': 'Последние победители',
        'how_it_works': 'Как это работает',
        'buy_tickets': 'Купить билеты',
        'security': 'Безопасность и прозрачность',
        'try_luck': 'Готовы испытать удачу?',
        'copyright': '© 2023 CryptoFortune. Все права защищены.'
        // Добавьте другие переводы по мере необходимости
    },
    en: {
        'home': 'Home',
        'lottery': 'Lottery',
        'faq': 'FAQ',
        'about': 'About',
        'login': 'Login',
        'register': 'Register',
        'jackpot': 'Current jackpot',
        'next_draw': 'Next draw in',
        'days': 'days',
        'hours': 'hours',
        'minutes': 'minutes',
        'seconds': 'seconds',
        'winners': 'Recent winners',
        'how_it_works': 'How it works',
        'buy_tickets': 'Buy tickets',
        'security': 'Security & Transparency',
        'try_luck': 'Ready to try your luck?',
        'copyright': '© 2023 CryptoFortune. All rights reserved.'
        // Добавьте другие переводы по мере необходимости
    }
};

function loadTranslations() {
    const currentLang = localStorage.getItem('siteLang') || 'ru';

    // Находим все элементы с атрибутом data-lang
    const elements = document.querySelectorAll('[data-lang]');

    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // Также обновляем атрибут lang у html
    document.documentElement.lang = currentLang;

    // Обновляем выбранный язык в селекторе
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
    }
}

// Экспортируем функцию для смены языка
window.changeLanguage = function(lang) {
    localStorage.setItem('siteLang', lang);
    loadTranslations();
};