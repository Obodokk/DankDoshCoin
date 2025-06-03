/**
 * Основной JavaScript файл для сайта CryptoFortune
 * Содержит общие функции и обработчики событий
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    initMobileMenu();

    // Инициализация языка
    initLanguage();

    // Инициализация анимаций при скролле
    initScrollAnimations();

    // Инициализация модальных окон
    initModals();
});

/**
 * Инициализация мобильного меню
 */

function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');

    // Создаем контейнер для кнопок авторизации
    const authContainer = document.createElement('div');
    authContainer.className = 'mobile-auth-container';
    document.body.appendChild(authContainer); // Добавляем в конец body

    if (burger && nav) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpening = !this.classList.contains('active');

            this.classList.toggle('active');
            nav.classList.toggle('active');
            authContainer.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            if (isOpening) {
                updateMobileAuthButtons();
            }
        });

        // Закрытие при клике на ссылки
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Обработчик для закрытия меню
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header') &&
            !e.target.closest('.mobile-auth-container')) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');
    const authContainer = document.querySelector('.mobile-auth-container');

    burger?.classList.remove('active');
    nav?.classList.remove('active');
    authContainer?.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function updateMobileAuthButtons() {
    const authContainer = document.querySelector('.mobile-auth-container');
    if (!authContainer) return;

    const user = JSON.parse(localStorage.getItem('cf_currentUser'));

    authContainer.innerHTML = user ? `
        <div class="mobile-user-profile">
            <a href="profile.html" class="user-info">
                <span class="material-icons">person</span>
                ${user.name || 'Профиль'}
            </a>
            <button id="mobileLogoutBtn" class="mobile-menu-link">
                <span class="material-icons">exit_to_app</span>
                Выйти
            </button>
        </div>
    ` : `
        <a href="login.html" class="mobile-menu-link">
            <span class="material-icons">login</span>
            Войти
        </a>
        <a href="register.html" class="mobile-menu-link">
            <span class="material-icons">person_add</span>
            Регистрация
        </a>
    `;

    // Обработчик выхода
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('cf_currentUser');
        closeMobileMenu();
        window.location.reload();
    });
}
/**
 * Инициализация языка
 */
function initLanguage() {
    // Проверяем язык браузера
    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = userLang.startsWith('ru') ? 'ru' : 'en';

    // Устанавливаем язык по умолчанию
    if (!localStorage.getItem('siteLang')) {
        localStorage.setItem('siteLang', defaultLang);
    }

    // Устанавливаем выбранный язык в селекторе
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = localStorage.getItem('siteLang');

        // Обработчик изменения языка
        langSelect.addEventListener('change', function() {
            localStorage.setItem('siteLang', this.value);
            window.location.reload();
        });
    }
}

/**
 * Инициализация анимаций при скролле
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Инициализация модальных окон
 */
function initModals() {
    // Открытие модального окна
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-open');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    // Закрытие модального окна
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Закрытие при клике вне модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
}

/**
 * Показывает уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип сообщения (success, error, warning)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
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
    }, 5000);
}

/**
 * Форматирует число с разделителями
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированная строка
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Экспорт функций для использования в других файлах
window.Common = {
    showNotification,
    formatNumber
};