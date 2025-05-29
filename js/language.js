/**
 * Мультиязычность сайта
 */

// Тексты для перевода
const translations = {
    ru: {
        // Общие
        'connectWallet': 'Подключить кошелек',
        'walletConnected': 'Кошелек подключен:',
        'disconnect': 'Отключить',

        // Главная
        'mainTitle': 'Крипто Лотерея нового поколения',
        'mainSubtitle': 'Выигрывайте крупные призы на блокчейне Polygon',
        'playNow': 'Играть сейчас',
        'currentJackpot': 'Текущий джекпот',
        'nextDraw': 'Следующий розыгрыш',
        'days': 'дней',
        'hours': 'часов',
        'minutes': 'минут',
        'seconds': 'секунд',
        'lastWinners': 'Последние победители',
        'howItWorks': 'Как это работает',
        'transparencyTitle': 'Безопасность и прозрачность',

        // Лотерея
        'buyTickets': 'Купить билеты',
        'ticketIncreasesChance': 'Каждый билет увеличивает шанс на победу!',
        'ticketPrice': '1 билет = 10 USDT',
        'drawSchedule': 'Каждые 3 дня, 20:00 GMT',
        'selectTickets': 'Выберите количество билетов',
        'orEnterAmount': 'Или введите свое число',
        'setAmount': 'Установить',
        'totalCost': 'Общая стоимость',
        'howToPlay': 'Как играть',
        'connectWalletStep': 'Подключите кошелек',
        'chooseTicketsStep': 'Выберите билеты',
        'confirmTransactionStep': 'Подтвердите транзакцию',
        'waitForDrawStep': 'Дождитесь розыгрыша',
        'yourChances': 'Ваши шансы на победу',
        'moreTickets': 'Чем больше билетов - тем выше шанс',
        'yourTickets': 'Ваши билеты',
        'ticketsRegistered': 'Билеты регистрируются автоматически',

        // FAQ
        'faqTitle': 'Часто задаваемые вопросы',
        'faqSubtitle': 'Здесь вы найдете ответы на самые популярные вопросы о CryptoFortune',
        'searchPlaceholder': 'Поиск по вопросам...',
        'searchButton': 'Найти',
        'allQuestions': 'Все вопросы',
        'general': 'Основное',
        'tickets': 'Билеты',
        'winnings': 'Выигрыши',
        'security': 'Безопасность',

        // О нас
        'aboutTitle': 'О CryptoFortune',
        'aboutSubtitle': 'Прозрачная и честная криптовалютная лотерея на блокчейне',
        'ourMission': 'Наша миссия',
        'howItWorksAbout': 'Как это работает',
        'technologies': 'Технологии',
        'contract': 'Контракт',
        'viewOnPolygonscan': 'Посмотреть на Polygonscan',
        'support': 'Поддержка',

        // 404
        'pageNotFound': 'Страница не найдена',
        'pageNotFoundText': 'Похоже, что страница, которую вы ищете, не существует или была перемещена.',
        'goHome': 'Вернуться на главную'
    },
    en: {
        // Общие
        'connectWallet': 'Connect Wallet',
        'walletConnected': 'Wallet connected:',
        'disconnect': 'Disconnect',

        // Главная
        'mainTitle': 'Next Generation Crypto Lottery',
        'mainSubtitle': 'Win big prizes on Polygon blockchain',
        'playNow': 'Play Now',
        'currentJackpot': 'Current Jackpot',
        'nextDraw': 'Next Draw',
        'days': 'days',
        'hours': 'hours',
        'minutes': 'minutes',
        'seconds': 'seconds',
        'lastWinners': 'Last Winners',
        'howItWorks': 'How It Works',
        'transparencyTitle': 'Security & Transparency',

        // Лотерея
        'buyTickets': 'Buy Tickets',
        'ticketIncreasesChance': 'Each ticket increases your chance to win!',
        'ticketPrice': '1 ticket = 10 USDT',
        'drawSchedule': 'Every 3 days, 20:00 GMT',
        'selectTickets': 'Select Ticket Amount',
        'orEnterAmount': 'Or enter your amount',
        'setAmount': 'Set',
        'totalCost': 'Total Cost',
        'howToPlay': 'How To Play',
        'connectWalletStep': 'Connect your wallet',
        'chooseTicketsStep': 'Choose tickets',
        'confirmTransactionStep': 'Confirm transaction',
        'waitForDrawStep': 'Wait for the draw',
        'yourChances': 'Your Winning Chances',
        'moreTickets': 'More tickets - higher chance',
        'yourTickets': 'Your Tickets',
        'ticketsRegistered': 'Tickets are registered automatically',

        // FAQ
        'faqTitle': 'Frequently Asked Questions',
        'faqSubtitle': 'Here you will find answers to the most common questions about CryptoFortune',
        'searchPlaceholder': 'Search questions...',
        'searchButton': 'Search',
        'allQuestions': 'All Questions',
        'general': 'General',
        'tickets': 'Tickets',
        'winnings': 'Winnings',
        'security': 'Security',

        // О нас
        'aboutTitle': 'About CryptoFortune',
        'aboutSubtitle': 'Transparent and fair cryptocurrency lottery on blockchain',
        'ourMission': 'Our Mission',
        'howItWorksAbout': 'How It Works',
        'technologies': 'Technologies',
        'contract': 'Contract',
        'viewOnPolygonscan': 'View on Polygonscan',
        'support': 'Support',

        // 404
        'pageNotFound': 'Page Not Found',
        'pageNotFoundText': 'It seems the page you are looking for does not exist or has been moved.',
        'goHome': 'Go to Homepage'
    }
};

// Текущий язык
let currentLanguage = 'ru';

// Инициализация языка
function initLanguage() {
    // Определяем язык браузера
    const browserLanguage = navigator.language.split('-')[0];

    // Поддерживаемые языки
    const supportedLanguages = ['ru', 'en'];

    // Устанавливаем язык по умолчанию (русский)
    let language = 'ru';

    // Если язык браузера поддерживается, используем его
    if (supportedLanguages.includes(browserLanguage)) {
        language = browserLanguage;
    }

    // Проверяем сохраненный язык в localStorage
    const savedLanguage = localStorage.getItem('cryptoFortuneLanguage');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        language = savedLanguage;
    }

    // Устанавливаем язык
    setLanguage(language);
}

// Установка языка
function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLanguage = lang;
    localStorage.setItem('cryptoFortuneLanguage', lang);

    // Обновляем все тексты на странице
    updateTexts();

    // Обновляем активную кнопку языка
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

// Обновление текстов на странице
function updateTexts() {
    const langData = translations[currentLanguage];

    // Обновляем все элементы с атрибутом data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });

    // Обновляем placeholder'ы
    const inputElements = document.querySelectorAll('[data-i18n-placeholder]');
    inputElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            el.setAttribute('placeholder', langData[key]);
        }
    });

    // Обновляем значения кнопок
    const buttonElements = document.querySelectorAll('[data-i18n-value]');
    buttonElements.forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initLanguage);