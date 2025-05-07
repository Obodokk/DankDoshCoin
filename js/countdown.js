// countdown.js - Полная версия с мультиязычной поддержкой
document.addEventListener('DOMContentLoaded', function() {
  initializeCountdown();
});

function initializeCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;

  // Убедимся, что время розыгрыша установлено
  if (!localStorage.getItem('nextDrawTime')) {
    setNextDrawTime();
  }

  let countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Сразу обновляем

  function updateCountdown() {
    const nextDrawTime = parseInt(localStorage.getItem('nextDrawTime'));
    const now = new Date().getTime();
    const distance = nextDrawTime - now;

    const currentLang = localStorage.getItem('language') || 'ru';
    const t = getCountdownTranslations(currentLang);

    if (distance > 0) {
      const { days, hours, minutes, seconds } = calculateTimeUnits(distance);
      renderCountdown(countdownElement, t, days, hours, minutes, seconds);
    } else {
      handleDrawStart(countdownElement, t.draw_started);
      clearInterval(countdownInterval);
      setNextDrawTime(); // Устанавливаем следующий розыгрыш
    }
  }
}

function setNextDrawTime() {
  const nextDraw = new Date();
  nextDraw.setUTCHours(20, 0, 0, 0);
  nextDraw.setUTCDate(nextDraw.getUTCDate() + 3); // +3 дня
  localStorage.setItem('nextDrawTime', nextDraw.getTime());
}

function calculateTimeUnits(distance) {
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  };
}

function getCountdownTranslations(lang) {
  return {
    next_draw: translations[lang]?.next_draw || 'Next draw in:',
    days: translations[lang]?.days || 'd',
    hours: translations[lang]?.hours || 'h',
    minutes: translations[lang]?.minutes || 'm',
    seconds: translations[lang]?.seconds || 's',
    draw_started: translations[lang]?.draw_started || 'Draw started!'
  };
}

function renderCountdown(element, t, days, hours, minutes, seconds) {
  element.innerHTML = `
    <span class="countdown-label">${t.next_draw}</span>
    <span class="countdown-number">${days.toString().padStart(2, '0')}</span><span class="countdown-unit">${t.days}</span>
    <span class="countdown-number">${hours.toString().padStart(2, '0')}</span><span class="countdown-unit">${t.hours}</span>
    <span class="countdown-number">${minutes.toString().padStart(2, '0')}</span><span class="countdown-unit">${t.minutes}</span>
    <span class="countdown-number">${seconds.toString().padStart(2, '0')}</span><span class="countdown-unit">${t.seconds}</span>
  `;
}

function handleDrawStart(element, text) {
  element.innerHTML = `<span class="draw-started">${text}</span>`;
  // Тут можно добавить вызов функции обновления джекпота
}