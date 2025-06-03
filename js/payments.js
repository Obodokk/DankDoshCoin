/**
 * Логика обработки платежей
 */

class PaymentSystem {
    constructor() {
        this.paymentAddresses = {}; // Хранит временные адреса для платежей
        this.paymentInterval = null; // Интервал проверки платежей
    }

    /**
     * Инициализирует систему платежей
     */
    init() {
        this.setupEventListeners();
        this.loadPaymentAddresses();
    }

    /**
     * Настраивает обработчики событий
     */
    setupEventListeners() {
        // Обработчик для кнопки "Я оплатил"
        document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => {
            this.confirmPayment();
        });
    }

    /**
     * Загружает сохраненные платежные адреса из localStorage
     */
    loadPaymentAddresses() {
        const savedAddresses = localStorage.getItem('cryptofortune_payment_addresses');
        if (savedAddresses) {
            this.paymentAddresses = JSON.parse(savedAddresses);
        }
    }

    /**
     * Сохраняет платежные адреса в localStorage
     */
    savePaymentAddresses() {
        localStorage.setItem(
            'cryptofortune_payment_addresses',
            JSON.stringify(this.paymentAddresses)
        );
    }

    /**
     * Генерирует новый временный платежный адрес
     * @param {number} amount - Сумма к оплате в USDT
     * @param {number} tickets - Количество билетов
     * @returns {string} Сгенерированный TRC20 адрес
     */
    generatePaymentAddress(amount, tickets) {
        const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);
        const address = this.generateTRONAddress();

        this.paymentAddresses[paymentId] = {
            address,
            amount,
            tickets,
            timestamp: Date.now(),
            status: 'pending'
        };

        this.savePaymentAddresses();
        this.startPaymentTracking(paymentId);

        return address;
    }

    /**
     * Генерирует случайный TRON адрес (для демонстрации)
     * @returns {string} Сгенерированный адрес
     */
    generateTRONAddress() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        let address = 'T';

        for (let i = 0; i < 33; i++) {
            address += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return address;
    }

    /**
     * Начинает отслеживание платежа по адресу
     * @param {string} paymentId - ID платежа
     */
    startPaymentTracking(paymentId) {
        if (this.paymentInterval) {
            clearInterval(this.paymentInterval);
        }

        // В реальном приложении здесь будет подключение к API блокчейна
        // Для демонстрации используем симуляцию
        this.paymentInterval = setInterval(() => {
            this.simulatePaymentCheck(paymentId);
        }, 5000);
    }

    /**
     * Симулирует проверку платежа (в реальном приложении - API запрос)
     * @param {string} paymentId - ID платежа
     */
    simulatePaymentCheck(paymentId) {
        const payment = this.paymentAddresses[paymentId];
        if (!payment) return;

        // Случайным образом "подтверждаем" платеж через некоторое время
        if (Math.random() > 0.7 && payment.status === 'pending') {
            payment.status = 'completed';
            this.savePaymentAddresses();
            clearInterval(this.paymentInterval);

            // Обновляем UI
            this.updatePaymentUI(true);

            // Добавляем билеты пользователю
            this.addUserTickets(payment.tickets);

            Common.showNotification('Платеж подтвержден! Билеты зачислены.', 'success');
        }
    }

    /**
     * Обновляет UI в зависимости от статуса платежа
     * @param {boolean} isCompleted - Завершен ли платеж
     */
    updatePaymentUI(isCompleted) {
        const statusProgress = document.querySelector('.status-progress');
        const statusText = document.querySelector('.status-text');
        const confirmBtn = document.getElementById('confirmPaymentBtn');

        if (isCompleted) {
            statusProgress.style.width = '100%';
            statusText.textContent = 'Платеж подтвержден! Билеты зачислены.';
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Готово';
        }
    }

    /**
     * Добавляет билеты пользователю (в реальном приложении - API запрос)
     * @param {number} tickets - Количество билетов
     */
    addUserTickets(tickets) {
        console.log(`Добавлено ${tickets} билетов пользователю`);
        // Здесь будет логика добавления билетов в базу данных
    }

    /**
     * Подтверждает платеж и закрывает модальное окно
     */
    confirmPayment() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
}

// Инициализация системы платежей при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const paymentSystem = new PaymentSystem();
    paymentSystem.init();

    // Экспортируем для использования в других модулях
    window.PaymentSystem = paymentSystem;
});