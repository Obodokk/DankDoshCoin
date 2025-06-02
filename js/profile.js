/**
 * profile.js - Полная система управления профилем
 * Включает:
 * - Загрузку данных профиля
 * - Обновление информации
 * - Реферальную систему
 * - Управление паролями
 * - Валидацию данных
 * - Уведомления в едином стиле
 */

class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    /**
     * Инициализация системы профиля
     */
    init() {
        this.checkAuthState();
        this.setupEventListeners();
        this.initPasswordToggles();
    }

    /**
     * Проверяет состояние авторизации
     */
    checkAuthState() {
        this.currentUser = this.getCurrentUser();

        if (!this.currentUser) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = 'auth/login.html';
            return;
        }

        this.loadProfileData();
    }

    /**
     * Настраивает обработчики событий
     */
    setupEventListeners() {
        // Форма обновления профиля
        document.getElementById('updateProfileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Кнопка копирования реферального кода
        document.getElementById('copyReferralBtn')?.addEventListener('click', () => {
            this.copyReferralCode();
        });

        // Кнопка приглашения друга
        document.getElementById('inviteFriendBtn')?.addEventListener('click', () => {
            this.inviteFriend();
        });

        // Мобильное меню
        document.getElementById('burger')?.addEventListener('click', this.toggleMobileMenu);
    }

    /**
     * Загружает данные профиля
     */
    loadProfileData() {
        if (!this.currentUser) return;

        // Основная информация
        document.getElementById('profileName').textContent = this.currentUser.name || 'Не указано';
        document.getElementById('profileEmail').textContent = this.currentUser.email || 'Не указан';
        document.getElementById('profileWallet').value = this.currentUser.wallet || '';

        // Дата регистрации
        const joinDate = this.currentUser.joinedDate ? new Date(this.currentUser.joinedDate) : new Date();
        document.getElementById('profileJoinDate').textContent = joinDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Статистика
        document.getElementById('userTickets').textContent = this.currentUser.tickets || 0;
        document.getElementById('userReferrals').textContent = this.currentUser.referrals?.length || 0;
        document.getElementById('userWins').textContent = this.currentUser.wins || 0;

        // Реферальная система
        this.initReferralSystem();

        // Кто пригласил
        if (this.currentUser.referredBy) {
            document.getElementById('referralParent').textContent = this.currentUser.referredBy;
        }
    }

    /**
     * Обновляет данные профиля
     */
    updateProfile() {
        const newWallet = document.getElementById('profileWallet').value.trim();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        // Валидация данных
        if (!this.validateProfileData(newWallet, currentPassword, newPassword)) {
            return;
        }

        // Обновление данных
        this.currentUser.wallet = newWallet;
        if (newPassword) {
            this.currentUser.password = newPassword;
        }

        // Сохранение
        if (this.saveUserData()) {
            this.showNotification('Профиль успешно обновлен', 'success');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
        } else {
            this.showNotification('Ошибка при сохранении данных', 'error');
        }
    }

    /**
     * Валидирует данные профиля
     */
    validateProfileData(wallet, currentPassword, newPassword) {
        // Валидация кошелька
        if (wallet && (!wallet.startsWith('T') || wallet.length < 25)) {
            this.showNotification('Укажите корректный TRON-адрес (начинается с T)', 'error');
            return false;
        }

        // Валидация пароля
        if (newPassword) {
            if (!currentPassword) {
                this.showNotification('Введите текущий пароль для изменения', 'error');
                return false;
            }

            if (this.currentUser.password !== currentPassword) {
                this.showNotification('Текущий пароль неверен', 'error');
                return false;
            }

            if (newPassword.length < 6) {
                this.showNotification('Пароль должен содержать минимум 6 символов', 'error');
                return false;
            }
        }

        return true;
    }

    /**
     * Инициализирует реферальную систему
     */
    initReferralSystem() {
        if (!this.currentUser.referralCode) {
            this.currentUser.referralCode = this.generateReferralCode();
            this.saveUserData();
        }

        document.getElementById('referralCode').textContent = this.currentUser.referralCode;
    }

    /**
     * Генерирует реферальный код
     */
    generateReferralCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'CF-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Копирует реферальный код
     */
    copyReferralCode() {
        const code = document.getElementById('referralCode').textContent;
        navigator.clipboard.writeText(code)
            .then(() => this.showNotification('Реферальный код скопирован!', 'success'))
            .catch(() => this.showNotification('Ошибка копирования', 'error'));
    }

    /**
     * Приглашение друга
     */
    inviteFriend() {
        const code = this.currentUser.referralCode;
        const shareUrl = `${window.location.origin}/register.html?ref=${code}`;
        const message = `Присоединяйся к CryptoFortune по моей ссылке и получи бонус!\n${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: 'Приглашение в CryptoFortune',
                text: 'Получи бонус за регистрацию по моей ссылке!',
                url: shareUrl
            }).catch(() => this.copyToClipboardFallback(message));
        } else {
            this.copyToClipboardFallback(message);
        }
    }

    /**
     * Fallback для копирования ссылки
     */
    copyToClipboardFallback(message) {
        navigator.clipboard.writeText(message)
            .then(() => this.showNotification('Ссылка скопирована в буфер обмена', 'success'))
            .catch(() => {
                prompt('Скопируйте эту ссылку для приглашения:', message);
                this.showNotification('Скопируйте ссылку из диалогового окна', 'info');
            });
    }

    /**
     * Инициализирует переключатели пароля
     */
    initPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const isPassword = input.type === 'password';

                input.type = isPassword ? 'text' : 'password';
                this.querySelector('.material-icons').textContent =
                    isPassword ? 'visibility_off' : 'visibility';
            });
        });
    }

    /**
     * Переключает мобильное меню
     */
    toggleMobileMenu() {
        const nav = document.querySelector('.nav');
        if (nav) nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    /**
     * Получает текущего пользователя
     */
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('cf_currentUser'));
        } catch (e) {
            console.error('Ошибка чтения данных пользователя:', e);
            return null;
        }
    }

    /**
     * Сохраняет данные пользователя
     */
    saveUserData() {
        try {
            const users = JSON.parse(localStorage.getItem('cf_users')) || [];
            const updatedUsers = users.map(u =>
                u.id === this.currentUser.id ? this.currentUser : u
            );

            localStorage.setItem('cf_users', JSON.stringify(updatedUsers));
            localStorage.setItem('cf_currentUser', JSON.stringify(this.currentUser));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения пользователя:', e);
            return false;
        }
    }

    /**
     * Показывает уведомление (единый стиль с лотереей)
     * @param {string} message - Текст сообщения
     * @param {string} type - Тип уведомления (success, error, warning, info)
     * @param {object} options - Дополнительные параметры
     */
    showNotification(message, type = 'success', options = {}) {
        // Используем общую систему уведомлений, если она есть
        if (window.Common && window.Common.showNotification) {
            window.Common.showNotification(message, type, options);
            return;
        }

        // Fallback реализация (аналогичная lottery.js)
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;

        notification.innerHTML = `
            <div class="notification__content">${message}</div>
            ${options.action ? `<button class="notification__action">${options.action}</button>` : ''}
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 10);

        // Обработчик кнопки действия
        if (options.action && options.callback) {
            notification.querySelector('.notification__action')
                .addEventListener('click', options.callback);
        }

        // Автоматическое закрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, options.duration || 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ProfileSystem();
});