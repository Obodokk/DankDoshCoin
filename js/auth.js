/**
 * auth.js - Система авторизации
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация системы
    initAuthSystem();

    function initAuthSystem() {
        // Проверяем авторизацию при загрузке
        checkAuthState();

        // Настраиваем формы авторизации
        setupAuthForms();
    }

    // Проверка состояния авторизации
    function checkAuthState() {
        const currentUser = getCurrentUser();
        updateAuthUI(currentUser);

        // Защита маршрутов
        if (window.location.pathname.includes('profile.html') && !currentUser) {
            window.location.href = 'auth/login.html';
        }
    }

    // Настройка форм авторизации
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

    // Обработка входа
    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Сохраняем пользователя
            localStorage.setItem('cf_currentUser', JSON.stringify(user));

            // Показываем уведомление
            showNotification('Вход выполнен успешно!', 'success');

            // Перенаправляем
            setTimeout(() => {
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '../index.html';
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            showNotification('Неверный email или пароль', 'error');
        }
    }

    // Обработка регистрации
    function handleRegistration() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const wallet = document.getElementById('registerWallet').value;

        const users = getUsers();

        // Проверка существующего пользователя
        if (users.some(u => u.email === email)) {
            showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }

        // Создаем нового пользователя
        const newUser = {
            id: generateId(),
            name,
            email,
            password,
            wallet,
            joinedDate: new Date().toISOString(),
            tickets: 0
        };

        // Сохраняем
        users.push(newUser);
        localStorage.setItem('cf_users', JSON.stringify(users));
        localStorage.setItem('cf_currentUser', JSON.stringify(newUser));

        showNotification('Регистрация прошла успешно!', 'success');

        // Перенаправляем
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Выход из системы
    function handleLogout() {
        localStorage.removeItem('cf_currentUser');
        sessionStorage.removeItem('redirectAfterLogin'); // Очищаем редирект
        showNotification('Вы успешно вышли', 'success');
        updateAuthUI(null);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Обновление интерфейса
    function updateAuthUI(user) {
        const authContainers = document.querySelectorAll('.auth-container');

        authContainers.forEach(container => {
            if (user) {
                // Показываем информацию пользователя
                container.innerHTML = `
                    <div class="user-profile">
                        <a href="profile.html" class="user-name">${user.name}</a>
                        <button id="logoutBtn" class="btn btn--outline">Выйти</button>
                    </div>
                `;

                // Настраиваем кнопку выхода
                container.querySelector('#logoutBtn').addEventListener('click', handleLogout);
            } else {
                // Показываем кнопки входа/регистрации
                container.innerHTML = `
                    <a href="auth/login.html" class="btn btn--outline">Войти</a>
                    <a href="auth/register.html" class="btn btn--primary">Регистрация</a>
                `;
            }
        });
    }

    // Вспомогательные функции
    function getUsers() {
        return JSON.parse(localStorage.getItem('cf_users')) || [];
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('cf_currentUser'));
    }

    function generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 10);
    }

    // Экспортируем функцию проверки авторизации
    window.isAuthenticated = function() {
        return !!getCurrentUser();
    };
});