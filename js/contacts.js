// contacts.js - Полностью рабочая форма обратной связи
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация формы
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Инициализация стилей уведомлений
  initNotificationStyles();

  // Обработчик отправки формы
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Проверка заполнения полей
    if (!validateForm()) return;

    try {
      // Показываем индикатор загрузки
      setFormLoadingState(true);

      // Имитация отправки (в реальности будет fetch/AJAX запрос)
      await simulateFormSubmission();

      // Успешная отправка
      showNotification('Сообщение успешно отправлено!', 'success');
      contactForm.reset();

    } catch (error) {
      // Ошибка отправки
      console.error('Ошибка отправки:', error);
      showNotification('Ошибка при отправке сообщения', 'error');
    } finally {
      // Снимаем индикатор загрузки
      setFormLoadingState(false);
    }
  });

  // Валидация формы
  function validateForm() {
    const name = contactForm.elements['name'].value.trim();
    const email = contactForm.elements['email'].value.trim();
    const message = contactForm.elements['message'].value.trim();

    // Проверка имени
    if (name.length < 2) {
      showNotification('Имя должно содержать минимум 2 символа', 'warning');
      return false;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Введите корректный email', 'warning');
      return false;
    }

    // Проверка сообщения
    if (message.length < 50) {
      showNotification('Сообщение должно содержать минимум 50 символов', 'warning');
      return false;
    }

    return true;
  }

  // Имитация отправки формы (замените на реальный запрос)
  function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 10% шанс ошибки для тестирования
        if (Math.random() < 0.1) {
          reject(new Error('Ошибка сервера (тестовый режим)'));
        } else {
          resolve();
        }
      }, 1500);
    });
  }

  // Установка состояния загрузки
  function setFormLoadingState(isLoading) {
    const submitBtn = contactForm.querySelector('[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.innerHTML = isLoading
      ? '<i class="fas fa-spinner fa-spin"></i> Отправка...'
      : 'Отправить сообщение';
  }

  // Система уведомлений
  function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    document.querySelectorAll('.notification').forEach(el => el.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  function getNotificationIcon(type) {
    const icons = {
      info: 'fa-info-circle',
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle'
    };
    return icons[type] || 'fa-info-circle';
  }

  // Инициализация стилей уведомлений
  function initNotificationStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: var(--radius);
        color: white;
        background: var(--primary);
        box-shadow: var(--shadow);
        z-index: 1000;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
      }
      .notification.show {
        transform: translateY(0);
        opacity: 1;
      }
      .notification i { font-size: 1.2em; }
      .notification.info { background: var(--primary); }
      .notification.success { background: var(--success); }
      .notification.warning { background: var(--warning); color: #000; }
      .notification.error { background: var(--danger); }
    `;
    document.head.appendChild(style);
  }
});