/**
 * auth.js - Улучшенная система авторизации
 * Исправления:
 * - Корректные редиректы после авторизации
 * - Рабочая мобильная версия меню
 * - Исправление 404 ошибки
 * - Сохранение стилей на страницах авторизации
 */

document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
});

function initAuthSystem() {
    checkAuthState();
    setupAuthForms();
    setupMobileAuthUI();
    setupLanguageSwitcher();
}

/**
 * Проверяет состояние авторизации и защищает маршруты
 */
function checkAuthState() {
    const currentUser = getCurrentUser();
    updateAuthUI(currentUser);

    // Защита маршрутов
    const protectedRoutes = ['profile.html'];
    const isProtectedRoute = protectedRoutes.some(route =>
        window.location.pathname.includes(route)
    );

    if (isProtectedRoute && !currentUser) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'login.html'; // Исправленный путь без /auth/
    }
}

/**
 * Настраивает формы авторизации
 */
function setupAuthForms() {
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
}

/**
 * Обработка входа пользователя
 */
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('cf_currentUser', JSON.stringify(user));
        showNotification('Вход выполнен успешно!', 'success');

        // Редирект с проверкой пути
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'profile.html';
        sessionStorage.removeItem('redirectAfterLogin');

        // Убедимся, что путь корректен
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

/**
 * Обработка регистрации пользователя
 */
function handleRegistration() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const wallet = document.getElementById('registerWallet').value;

    const users = getUsers();

    if (users.some(u => u.email === email)) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    // Проверка реферального кода из URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');

    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        wallet,
        joinedDate: new Date().toISOString(),
        tickets: 0,
        wins: 0,
        referrals: [],
        referredBy: referralCode || null,
        referralCode: generateReferralCode()
    };

    users.push(newUser);
    localStorage.setItem('cf_users', JSON.stringify(users));
    localStorage.setItem('cf_currentUser', JSON.stringify(newUser));

    showNotification('Регистрация прошла успешно!', 'success');

    // Редирект на профиль
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1500);
}

/**
 * Обработка выхода пользователя
 */
function handleLogout() {
    localStorage.removeItem('cf_currentUser');
    showNotification('Вы успешно вышли', 'success');
    updateAuthUI(null);
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Обновляет интерфейс авторизации (десктоп и мобильный)
 */
function updateAuthUI(user) {
    updateMainAuthUI(user);
    updateMobileAuthUI(user);
}

/**
 * Обновляет основной интерфейс авторизации
 */
function updateMainAuthUI(user) {
    const authContainers = document.querySelectorAll('.auth-container');

    authContainers.forEach(container => {
        if (user) {
            container.innerHTML = `
                <div class="user-profile">
                    <a href="profile.html" class="user-name">${user.name}</a>
                    <button id="logoutBtn" class="btn btn--outline">Выйти</button>
                </div>
            `;
            container.querySelector('#logoutBtn').addEventListener('click', handleLogout);
        } else {
            container.innerHTML = `
                <a href="login.html" class="btn btn--outline">Войти</a>
                <a href="register.html" class="btn btn--primary">Регистрация</a>
            `;
        }
    });
}

/**
 * Обновляет мобильный интерфейс авторизации
 */
function updateMobileAuthUI(user) {
    const mobileAuthContainer = document.querySelector('.mobile-auth-container');

    if (!mobileAuthContainer) {
        const nav = document.querySelector('.nav');
        if (nav) {
            const authContainer = document.createElement('div');
            authContainer.className = 'mobile-auth-container';
            nav.appendChild(authContainer);
        }
        return;
    }

    if (user) {
        mobileAuthContainer.innerHTML = `
            <div class="mobile-user-profile">
                <div class="user-info">
                    <span class="material-icons">account_circle</span>
                    <span>${user.name}</span>
                </div>
                <a href="profile.html" class="mobile-menu-link">
                    <span class="material-icons">person</span>
                    Профиль
                </a>
                <button id="mobileLogoutBtn" class="mobile-menu-link">
                    <span class="material-icons">exit_to_app</span>
                    Выйти
                </button>
            </div>
        `;
        mobileAuthContainer.querySelector('#mobileLogoutBtn').addEventListener('click', handleLogout);
    } else {
        mobileAuthContainer.innerHTML = `
            <a href="login.html" class="mobile-menu-link">
                <span class="material-icons">login</span>
                Войти
            </a>
            <a href="register.html" class="mobile-menu-link">
                <span class="material-icons">person_add</span>
                Регистрация
            </a>
        `;
    }
}

/**
 * Инициализирует мобильное меню авторизации
 */
function setupMobileAuthUI() {
    const nav = document.querySelector('.nav');
    if (nav && !document.querySelector('.mobile-auth-container')) {
        const authContainer = document.createElement('div');
        authContainer.className = 'mobile-auth-container';
        nav.appendChild(authContainer);
    }
    updateMobileAuthUI(getCurrentUser());
}

/**
 * Настраивает переключатель языка
 */
function setupLanguageSwitcher() {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            localStorage.setItem('siteLang', this.value);
            window.location.reload();
        });
    }
}

/**
 * Генерирует реферальный код
 */
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CF-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Вспомогательные функции
 */
function getUsers() {
    return JSON.parse(localStorage.getItem('cf_users')) || [];
}

function getCurrentUser() {
    const user = localStorage.getItem('cf_currentUser');
    return user ? JSON.parse(user) : null;
}

function generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type) {
    if (window.Common && window.Common.showNotification) {
        window.Common.showNotification(message, type);
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 10);
}

// Экспорт функции проверки авторизации
window.isAuthenticated = function() {
    return !!getCurrentUser();
};