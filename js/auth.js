/**
 * auth.js - Полная система авторизации с реферальной программой
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Система авторизации загружена');
    initAuthSystem();
});

// Основные функции

function initAuthSystem() {
    checkAuthState();
    setupAuthForms();
    updateAuthUI(getCurrentUser());
}

function checkAuthState() {
    const user = getCurrentUser();
    if (window.location.pathname.includes('profile.html') && !user) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'login.html';
    }
}

function setupAuthForms() {
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Форма регистрации - ОСНОВНОЙ ИСПРАВЛЕННЫЙ БЛОК
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Форма регистрации отправлена');
            handleRegistration();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('cf_currentUser', JSON.stringify(user));
        showNotification('Вход выполнен успешно!', 'success');

        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'profile.html';
        setTimeout(() => window.location.href = redirectUrl, 1000);
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

function handleRegistration() {
    // Получаем значения из формы
    const formData = {
        name: document.getElementById('registerName').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('registerConfirmPassword').value,
        wallet: document.getElementById('registerWallet').value.trim(),
        referralCode: document.getElementById('registerReferral')?.value.trim() || null
    };

    // Валидация данных
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.wallet) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    if (formData.password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }

    if (!formData.wallet.startsWith('T') || formData.wallet.length < 25) {
        showNotification('Укажите корректный TRON-адрес (начинается с T)', 'error');
        return;
    }

    // Работа с данными пользователей
    let users = getUsers();
    if (!Array.isArray(users)) users = [];

    if (users.some(u => u.email === formData.email)) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    // Создаем нового пользователя
    const newUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        wallet: formData.wallet,
        joinedDate: new Date().toISOString(),
        tickets: 0,
        wins: 0,
        referralCode: 'CF-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        referredBy: null,
        referrals: [],
        activityLog: [],
        referralRewards: {
            level1: false,
            level5: false,
            level15: false
        }
    };

    // Обработка реферального кода
    if (formData.referralCode) {
        const referrer = users.find(u => u.referralCode === formData.referralCode);
        if (referrer) {
            newUser.referredBy = referrer.email;

            // Инициализируем массивы если их нет
            if (!referrer.referrals) referrer.referrals = [];
            if (!referrer.activityLog) referrer.activityLog = [];

            referrer.referrals.push({
                userId: newUser.id,
                email: newUser.email,
                date: new Date().toISOString(),
                rewarded: false
            });

            referrer.activityLog.push({
                type: 'referral_signup',
                date: new Date().toISOString(),
                message: `Пользователь ${newUser.email} зарегистрировался по вашей ссылке`,
                reward: 'Ожидает покупки билетов'
            });
        }
    }

    // Сохраняем данные
    users.push(newUser);
    localStorage.setItem('cf_users', JSON.stringify(users));
    localStorage.setItem('cf_currentUser', JSON.stringify(newUser));

    showNotification('Регистрация прошла успешно!', 'success');
    setTimeout(() => window.location.href = 'profile.html', 1500);
}

// Вспомогательные функции

function updateAuthUI(user) {
    const authContainers = document.querySelectorAll('.auth-container');

    authContainers.forEach(container => {
        if (user) {
            container.innerHTML = `
                <div class="user-profile">
                    <a href="profile.html" class="user-name">
                        <span class="material-icons">person</span>
                        ${user.name}
                    </a>
                    <button id="logoutBtn" class="btn btn--outline">
                        <span class="material-icons">exit_to_app</span>
                        Выйти
                    </button>
                </div>
            `;

            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        } else {
            container.innerHTML = `
                <a href="login.html" class="btn btn--outline">
                    <span class="material-icons">login</span>
                    Войти
                </a>
                <a href="register.html" class="btn btn--primary">
                    <span class="material-icons">person_add</span>
                    Регистрация
                </a>
            `;
        }
    });
}

function handleLogout() {
    localStorage.removeItem('cf_currentUser');
    showNotification('Вы успешно вышли', 'success');
    updateAuthUI(null);
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('cf_users')) || [];
    } catch {
        return [];
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('cf_currentUser'));
    } catch {
        return null;
    }
}

function showNotification(message, type = 'success') {
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

// Экспорт для других модулей
window.isAuthenticated = function() {
    return !!getCurrentUser();
};