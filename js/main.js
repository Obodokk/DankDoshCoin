/**
 * Основной файл JavaScript для CryptoFortune
 * Содержит общие функции и обработчики событий для всего сайта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    initMobileMenu();

    // Инициализация переключателя языка
    initLanguageSwitcher();

    // Проверка сохраненного состояния кошелька
    checkWalletConnection();

    // Добавление анимаций при скролле
    initScrollAnimations();
});

/**
 * Инициализация мобильного меню (гамбургер)
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

/**
 * Инициализация переключателя языка
 */
function initLanguageSwitcher() {
    const languageOptions = document.querySelectorAll('.language-option');

    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);

            // Обновляем активное состояние
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Установка языка сайта
 * @param {string} lang - Язык для установки (ru/en)
 */
function setLanguage(lang) {
    // Здесь будет логика смены языка
    console.log(`Язык изменен на: ${lang}`);
    // В реальной реализации здесь будет загрузка переводов и обновление текста на странице
}

/**
 * Проверка сохраненного подключения кошелька
 */
function checkWalletConnection() {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
        // В реальной реализации здесь будет восстановление подключения
        document.getElementById('connectWalletBtn').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'flex';
        document.getElementById('walletAddress').textContent = shortenAddress(savedWallet);
    }
}

/**
 * Сокращение адреса кошелька для отображения
 * @param {string} address - Полный адрес кошелька
 * @returns {string} Сокращенный адрес (первые и последние 4 символа)
 */
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Инициализация анимаций при скролле
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-in, .slide-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Показать уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success/error/info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Создать эффект конфетти
 */
function createConfetti() {
    const colors = ['#6e45e2', '#88d3ce', '#ff7e5f', '#f0f'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(confetti);
    }

    setTimeout(() => {
        document.body.removeChild(container);
    }, 5000);
}