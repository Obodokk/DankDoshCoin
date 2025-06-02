/**
 * Таймер обратного отсчета до следующего розыгрыша
 */

document.addEventListener('DOMContentLoaded', function() {
    initTimer();
});

function initTimer() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const jackpotAmountEl = document.getElementById('jackpotAmount');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Получаем или устанавливаем сумму джекпота в localStorage
    let jackpotAmount = localStorage.getItem('current_jackpot');

    if (!jackpotAmount) {
        jackpotAmount = Math.floor(Math.random() * (1400 - 700 + 1)) + 700;
        localStorage.setItem('current_jackpot', jackpotAmount);
        // Устанавливаем время следующего обновления джекпота
        const nextDrawDate = getNextDrawDate();
        localStorage.setItem('next_jackpot_update', nextDrawDate.getTime());
    }

    if (jackpotAmountEl) {
        jackpotAmountEl.textContent = `${parseInt(jackpotAmount).toLocaleString()} USDT`;
    }

    // Проверяем, не нужно ли обновить джекпот
    const nextUpdate = parseInt(localStorage.getItem('next_jackpot_update'));
    if (nextUpdate && Date.now() > nextUpdate) {
        jackpotAmount = Math.floor(Math.random() * (1400 - 700 + 1)) + 700;
        localStorage.setItem('current_jackpot', jackpotAmount);
        const nextDrawDate = getNextDrawDate();
        localStorage.setItem('next_jackpot_update', nextDrawDate.getTime());
        if (jackpotAmountEl) {
            jackpotAmountEl.textContent = `${jackpotAmount.toLocaleString()} USDT`;
        }
    }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
}