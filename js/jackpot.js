// Функция генерации случайного джекпота
function generateRandomJackpot() {
  const min = 1000;
  const max = 1500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Обновляем джекпот на всех страницах
function updateJackpotDisplay() {
  let jackpot = localStorage.getItem('currentJackpot');

  // Если джекпота нет в хранилище - генерируем новый
  if (!jackpot) {
    jackpot = generateRandomJackpot();
    localStorage.setItem('currentJackpot', jackpot);
    localStorage.setItem('nextDrawTime', calculateNextDrawTime());
  }

  // Форматируем сумму (1,500 USDT)
  const formattedJackpot = new Intl.NumberFormat('en-US').format(jackpot) + ' USDT';

  // Обновляем на всех элементах с классами
  document.querySelectorAll('.jackpot-amount, .current-jackpot').forEach(el => {
    el.textContent = formattedJackpot;
  });
}

// Рассчитываем время следующего розыгрыша (каждые 3 дня в 20:00 GMT)
function calculateNextDrawTime() {
  const now = new Date();
  const nextDraw = new Date();

  // Устанавливаем время 20:00 GMT
  nextDraw.setUTCHours(20, 0, 0, 0);

  // Добавляем 3 дня
  nextDraw.setUTCDate(now.getUTCDate() + 3);

  return nextDraw.getTime();
}

// Проверяем, нужно ли обновить джекпот
function checkForDrawUpdate() {
  const nextDrawTime = parseInt(localStorage.getItem('nextDrawTime'));
  const now = new Date().getTime();

  if (now >= nextDrawTime) {
    const newJackpot = generateRandomJackpot();
    localStorage.setItem('currentJackpot', newJackpot);
    localStorage.setItem('nextDrawTime', calculateNextDrawTime());
    showNotification('Джекпот обновлен! Новый розыгрыш через 3 дня', 'success');
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  checkForDrawUpdate();
  updateJackpotDisplay();
});

// Синхронизация между вкладками
window.addEventListener('storage', function(e) {
  if (e.key === 'currentJackpot') {
    updateJackpotDisplay();
  }
});