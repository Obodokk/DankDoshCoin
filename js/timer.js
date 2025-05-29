/**
 * Таймер обратного отсчета до следующего розыгрыша
 */

// Время следующего розыгрыша (каждые 3 дня в 20:00 GMT)
function getNextDrawTime() {
    const now = new Date();
    const draw = new Date();

    // Устанавливаем время на 20:00 GMT
    draw.setUTCHours(20, 0, 0, 0);

    // Если сегодня уже было 20:00 GMT, переходим к следующему розыгрышу через 3 дня
    if (now.getTime() > draw.getTime()) {
        draw.setUTCDate(draw.getUTCDate() + 3);
    }

    // Если сегодня день розыгрыша, но время еще не наступило, оставляем сегодня
    return draw;
}

// Инициализация таймера
function initTimer() {
    const nextDraw = getNextDrawTime();
    updateTimer(nextDraw);

    // Обновляем таймер каждую секунду
    const timerInterval = setInterval(() => {
        updateTimer(nextDraw);
    }, 1000);
}

// Обновление отображения таймера
function updateTimer(nextDraw) {
    const now = new Date();
    const diff = nextDraw - now;

    // Если время розыгрыша наступило
    if (diff <= 0) {
        clearInterval(timerInterval);
        handleDrawTime();
        return;
    }

    // Вычисляем оставшееся время
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Обновляем DOM
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

    // Анимация при приближении розыгрыша
    if (days === 0 && hours < 6) {
        const jackpotAmount = document.querySelector('.jackpot-amount');
        if (jackpotAmount) {
            jackpotAmount.classList.add('pulse');
        }
    }
}

// Обработка времени розыгрыша
function handleDrawTime() {
    // Здесь будет логика проведения розыгрыша
    console.log('Время розыгрыша!');

    // Показываем анимацию
    createConfetti();

    // Обновляем таймер для следующего розыгрыша
    setTimeout(() => {
        initTimer();
    }, 10000); // Через 10 секунд обновляем таймер

    // Обновляем сумму джекпота (в реальной реализации будет запрос к контракту)
    updateJackpot();
}

// Обновление суммы джекпота
function updateJackpot() {
    const jackpotAmount = document.querySelector('.jackpot-amount');
    if (jackpotAmount) {
        // В реальной реализации здесь будет запрос к контракту
        const currentAmount = parseFloat(jackpotAmount.textContent.replace(',', ''));
        const newAmount = currentAmount + Math.floor(Math.random() * 500) + 100;

        // Анимация изменения суммы
        jackpotAmount.classList.add('jackpot-increase');
        setTimeout(() => {
            jackpotAmount.textContent = newAmount.toLocaleString('en-US') + ' USDT';
            jackpotAmount.classList.remove('jackpot-increase');
        }, 500);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initTimer);