/**
 * profile.js - Полная система управления профилем
 * Включает:
 * - Загрузку данных профиля
 * - Реферальную систему
 * - Историю активности
 * - Обновление информации
 */

class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.init();
        this.initMobileMenu();
    }

    /**
     * Инициализация системы профиля
     */
    init() {
        this.checkAuthState();
        this.setupEventListeners();
        this.initPasswordToggles();
        this.initMobileMenu();
        this.checkReferralRewards();
    }

    /**
     * Проверяет состояние авторизации
     */
    checkAuthState() {
        this.currentUser = this.getCurrentUser();

        if (!this.currentUser) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = 'login.html';
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
    }

    /**
     * Проверяет и применяет реферальные награды
     */
    checkReferralRewards() {
        if (!this.currentUser) return;
        const updatedUser = checkAndApplyReferralRewards(this.currentUser.id);
        if (updatedUser) {
            this.currentUser = updatedUser;
            this.loadProfileData();
        }
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

        // Кто пригласил
        if (this.currentUser.referredBy) {
            const users = JSON.parse(localStorage.getItem('cf_users')) || [];
            const referrer = users.find(u => u.email === this.currentUser.referredBy);
            document.getElementById('referralParent').textContent = referrer ? referrer.name : this.currentUser.referredBy;
        }

        // Реферальная система
        this.initReferralSystem();

        // История активности
        this.loadActivityLog();
    }

    /**
     * Загружает историю активности
     */
    loadActivityLog() {
        const timeline = document.getElementById('activityTimeline');
        if (!timeline || !this.currentUser.activityLog) return;

        // Очищаем placeholder
        timeline.querySelector('.timeline-placeholder')?.remove();

        // Сортируем лог по дате (новые сверху)
        const sortedLog = [...this.currentUser.activityLog].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        // Добавляем записи в ленту активности
        sortedLog.forEach(entry => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            let icon = '';
            let color = '';

            switch(entry.type) {
                case 'referral_signup':
                    icon = 'person_add';
                    color = 'var(--primary-color)';
                    break;
                case 'referral_reward':
                    icon = 'card_giftcard';
                    color = 'var(--success-color)';
                    break;
                case 'ticket_purchase':
                    icon = 'confirmation_number';
                    color = 'var(--secondary-color)';
                    break;
                case 'win':
                    icon = 'emoji_events';
                    color = 'var(--accent-color)';
                    break;
                default:
                    icon = 'info';
                    color = 'var(--dark-color)';
            }

            activityItem.innerHTML = `
                <div class="activity-icon" style="background: ${color}">
                    <span class="material-icons">${icon}</span>
                </div>
                <div class="activity-content">
                    <div class="activity-message">${entry.message}</div>
                    <div class="activity-date">${new Date(entry.date).toLocaleString('ru-RU')}</div>
                    ${entry.reward ? `<div class="activity-reward">${entry.reward}</div>` : ''}
                </div>
            `;

            timeline.appendChild(activityItem);
        });
    }

    /**
     * Инициализирует реферальную систему
     */
    initReferralSystem() {
        if (!this.currentUser.referralCode) {
            this.currentUser.referralCode = generateReferralCode();
            this.saveUserData();
        }

        document.getElementById('referralCode').textContent = this.currentUser.referralCode;
    }

    /**
     * Обновляет данные профиля
     */
    updateProfile() {
        const newWallet = document.getElementById('profileWallet').value.trim();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        if (!this.validateProfileData(newWallet, currentPassword, newPassword)) {
            return;
        }

        this.currentUser.wallet = newWallet;
        if (newPassword) {
            this.currentUser.password = newPassword;
        }

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
        if (wallet && (!wallet.startsWith('T') || wallet.length < 25)) {
            this.showNotification('Укажите корректный TRON-адрес (начинается с T)', 'error');
            return false;
        }

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
     * Инициализирует мобильное меню
     */
    initMobileMenu() {
        const burger = document.getElementById('burger');
        const nav = document.querySelector('.nav');
        const authContainer = document.createElement('div');
        authContainer.className = 'mobile-auth-container';
        document.body.appendChild(authContainer);

        if (burger && nav) {
            burger.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = this.classList.toggle('active');

                nav.classList.toggle('active');
                authContainer.classList.toggle('active');
                document.body.classList.toggle('no-scroll', isActive);

                if (isActive) {
                    this.setAttribute('aria-expanded', 'true');
                    updateMobileAuthButtons();
                } else {
                    this.setAttribute('aria-expanded', 'false');
                }
            });

            // Обновляем кнопки при изменении авторизации
            document.addEventListener('authStateChanged', updateMobileAuthButtons);
        }

        function updateMobileAuthButtons() {
            const user = JSON.parse(localStorage.getItem('cf_currentUser'));

            authContainer.innerHTML = user ? `
                <div class="mobile-user-profile">
                    <a href="profile.html" class="user-info">
                        <span class="material-icons">person</span>
                        ${user.name}
                    </a>
                    <button id="mobileLogoutBtn" class="btn btn--outline">
                        <span class="material-icons">exit_to_app</span>
                        Выйти
                    </button>
                </div>
            ` : `
                <div class="auth-buttons">
                    <a href="login.html" class="btn btn--primary">
                        <span class="material-icons">login</span>
                        Войти
                    </a>
                    <a href="register.html" class="btn btn--outline">
                        <span class="material-icons">person_add</span>
                        Регистрация
                    </a>
                </div>
            `;

            document.getElementById('mobileLogoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('cf_currentUser');
                window.location.reload();
            });
        }
    }

    /**
     * Переключает мобильное меню
     */
    toggleMobileMenu() {
        const burger = document.getElementById('burger');
        const nav = document.querySelector('.nav');
        const auth = document.querySelector('.auth');

        burger.classList.toggle('active');
        nav.classList.toggle('active');

        if (auth) {
            auth.classList.toggle('active');
        }

        document.body.classList.toggle('no-scroll');
    }

    /**
     * Закрывает мобильное меню
     */
    closeMobileMenu() {
        const burger = document.getElementById('burger');
        const nav = document.querySelector('.nav');
        const auth = document.querySelector('.auth');

        burger?.classList.remove('active');
        nav?.classList.remove('active');
        auth?.classList.remove('active');
        document.body.classList.remove('no-scroll');
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
     * Показывает уведомление
     */
    showNotification(message, type = 'success') {
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
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ProfileSystem();
});