/**
 * lottery.js - Полная логика работы страницы лотереи
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация при загрузке страницы
    initTicketSelection();
    initBuyButton();
    initPaymentModal();

    // Текущее количество выбранных билетов
    let selectedTickets = 0;

    // ============= ОСНОВНЫЕ ФУНКЦИИ =============

    function initTicketSelection() {
        const ticketOptions = document.querySelectorAll('.ticket-option');
        const customTicketsInput = document.getElementById('customTickets');
        const setTicketsBtn = document.getElementById('setTickets');

        // Обработка клика по вариантам билетов
        ticketOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Снимаем выделение со всех вариантов
                ticketOptions.forEach(opt => opt.classList.remove('active'));

                // Выделяем выбранный вариант
                this.classList.add('active');

                // Устанавливаем количество билетов
                selectedTickets = parseInt(this.getAttribute('data-tickets'));
                updateUI();
            });
        });

        // Обработка ручного ввода количества
        setTicketsBtn.addEventListener('click', function() {
            const value = parseInt(customTicketsInput.value);

            if (!value || value < 1) {
                showNotification('Введите корректное количество билетов', 'error');
                return;
            }

            selectedTickets = value;
            updateUI();
            showNotification(`Установлено ${value} билетов`, 'success');

            // Снимаем выделение с других вариантов
            ticketOptions.forEach(opt => opt.classList.remove('active'));
        });
    }

    function initBuyButton() {
        const buyBtn = document.getElementById('buyTicketsBtn');

        buyBtn.addEventListener('click', function() {
            if (selectedTickets === 0) {
                showNotification('Выберите количество билетов', 'error');
                return;
            }

            // Проверка авторизации через AuthSystem
            if (!window.isAuthenticated()) {
                // Сохраняем текущую страницу для перенаправления
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

                showNotification('Для покупки билетов необходимо авторизоваться', 'warning', {
                    action: 'Войти',
                    callback: () => { window.location.href = 'auth/login.html'; }
                });
                return;
            }

            showPaymentModal();
        });
    }

    function initPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelPaymentBtn');
        const confirmBtn = document.getElementById('confirmPaymentBtn');
        const copyBtn = document.getElementById('copyAddressBtn');

        // Закрытие модального окна
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', closePaymentModal);
        });

        // Клик вне модального окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closePaymentModal();
        });

        // Копирование адреса
        copyBtn.addEventListener('click', function() {
            const address = document.getElementById('modalAddress').textContent;
            navigator.clipboard.writeText(address)
                .then(() => showNotification('Адрес скопирован', 'success'))
                .catch(() => showNotification('Ошибка копирования', 'error'));
        });

        // Подтверждение оплаты
        confirmBtn.addEventListener('click', function() {
            showNotification('Билеты успешно куплены!', 'success');
            closePaymentModal();
        });
    }

    // ============= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =============

    function updateUI() {
        // Обновляем отображение стоимости
        const totalCost = selectedTickets * 10;
        document.querySelector('.cost-amount').textContent = `${totalCost} USDT`;

        // Обновляем шкалу шансов (примерная логика)
        const chancePercent = Math.min(selectedTickets * 0.5, 100);
        document.querySelector('.meter-bar').style.width = `${chancePercent}%`;
    }

    function showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const totalCost = selectedTickets * 10;

        // Заполняем данные в модальном окне
        document.getElementById('modalTickets').textContent = selectedTickets;
        document.getElementById('modalAmount').textContent = `${totalCost} USDT`;
        document.getElementById('modalAmount2').textContent = `${totalCost} USDT`;

        // Генерируем случайный адрес (в реальном проекте - запрос к API)
        document.getElementById('modalAddress').textContent = generateTronAddress();

        // Сбрасываем состояние оплаты
        document.querySelector('.status-progress').style.width = '0%';
        document.querySelector('.status-text').textContent = 'Ожидание оплаты...';
        document.getElementById('confirmPaymentBtn').disabled = true;

        // Показываем модальное окно
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Запускаем "проверку платежа"
        simulatePaymentCheck();
    }

    function closePaymentModal() {
        document.getElementById('paymentModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function generateTronAddress() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        let address = 'T';
        for (let i = 0; i < 33; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return address;
    }

    function simulatePaymentCheck() {
        const progressBar = document.querySelector('.status-progress');
        const statusText = document.querySelector('.status-text');
        const confirmBtn = document.getElementById('confirmPaymentBtn');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                statusText.textContent = 'Платеж подтвержден!';
                confirmBtn.disabled = false;
            } else if (progress > 70) {
                statusText.textContent = 'Подтверждение транзакции...';
            } else if (progress > 30) {
                statusText.textContent = 'Платеж обнаружен...';
            }
        }, 300);

        // Остановка при закрытии модалки
        document.getElementById('paymentModal').addEventListener('modalClose', () => {
            clearInterval(interval);
        });
    }

    function isAuthenticated() {
        // Заглушка - в реальном проекте проверяем наличие токена
        return localStorage.getItem('authToken') !== null;
    }

    function showNotification(message, type = 'success', options = {}) {
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

        // Автоматическое закрытие через 5 сек
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
});