// main.js - Основной файл инициализации с сохранением всех функций

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация всех основных функций
  initializeTheme();          // Темная/светлая тема
  initializeMobileMenu();     // Мобильное меню
  initializeActivePage();     // Подсветка активной страницы
  initializeSmoothScroll();   // Плавная прокрутка
  initializeLanguageSwitcher(); // Переключение языка
  initializeAnimations();     // Анимации элементов
  initializeCountdownRefresh(); // Обновление таймера

  // Проверка инициализации менеджера кошельков
  if (typeof Web3 !== 'undefined' && !window.walletManager) {
    setTimeout(() => {
      if (!window.walletManager) {
        console.log('Ожидание инициализации Wallet Manager...');
      }
    }, 500);
  }
});

/**
 * Инициализация темы (светлая/темная)
 */
function initializeTheme() {
  // Получение сохраненной темы или темы системы
  const savedTheme = localStorage.getItem('theme');
  const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const currentTheme = savedTheme || osTheme;

  // Применение темы
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (!savedTheme) localStorage.setItem('theme', currentTheme);

  // Настройка кнопки переключения темы
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    updateThemeIcon(currentTheme);
  }

  // Слежение за изменением темы системы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });
}

/**
 * Переключение между темами
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

/**
 * Обновление иконки темы
 */
function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    icon.setAttribute('aria-label',
      theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему');
  }
}

/**
 * Инициализация мобильного меню
 */
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('open');
      navMenu.classList.toggle('show');
      this.setAttribute('aria-expanded', this.classList.contains('open'));
    });

    // Закрытие меню при клике на ссылку (на мобильных)
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          mobileMenuBtn.classList.remove('open');
          navMenu.classList.remove('show');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

/**
 * Подсветка активной страницы в меню
 */
function initializeActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul li a').forEach(link => {
    if (currentPage === link.getAttribute('href')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Настройка плавной прокрутки к якорям
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Инициализация переключателя языка
 */
function initializeLanguageSwitcher() {
  const languageSelect = document.getElementById('languageSelect');
  if (!languageSelect) return;

  // Установка сохраненного языка или русского по умолчанию
  const savedLanguage = localStorage.getItem('language') || 'ru';
  languageSelect.value = savedLanguage;
  applyTranslations(savedLanguage);

  // Обработчик изменения языка
  languageSelect.addEventListener('change', function() {
    const newLanguage = this.value;
    localStorage.setItem('language', newLanguage);
    applyTranslations(newLanguage);
    window.dispatchEvent(new Event('languageChanged'));
  });
}

/**
 * Применение переводов к интерфейсу
 */
function applyTranslations(lang) {
  if (!window.translations) {
    console.warn('Файл переводов не загружен');
    return;
  }

  // Применение переводов к элементам с data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];

      // Для полей ввода - установка placeholder
      if (el.tagName === 'INPUT' && translations[lang][`${key}_placeholder`]) {
        el.placeholder = translations[lang][`${key}_placeholder`];
      }
    }
  });

  // Применение переводов к пунктам меню
  document.querySelectorAll('[data-i18n-menu]').forEach(el => {
    const key = el.getAttribute('data-i18n-menu');
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });
}

/**
 * Обновление таймера при смене языка
 */
function initializeCountdownRefresh() {
  window.addEventListener('languageChanged', function() {
    if (typeof initializeCountdown === 'function') {
      initializeCountdown();
    }
  });
}

/**
 * Инициализация анимаций при скролле
 */
function initializeAnimations() {
  // Первоначальная проверка
  animateOnScroll();

  // Проверка при скролле
  window.addEventListener('scroll', animateOnScroll, { passive: true });

  function animateOnScroll() {
    const elements = document.querySelectorAll(
      '.step, .feature, .winner-card, .contact-card, .ticket-number'
    );
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < triggerPoint) {
        element.classList.add('animate');
      }
    });
  }
}

/**
 * Показ уведомления (совместимость с web3.js)
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип сообщения (info, success, warning, error)
 */
window.showNotification = function(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type} slide-up`;
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
};

/**
 * Получение иконки для уведомления
 */
function getNotificationIcon(type) {
  const icons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
  };
  return icons[type] || 'fa-info-circle';
}

/**
 * Обработчик отправки форм (защита от двойного клика)
 */
document.addEventListener('submit', function(e) {
  const form = e.target.closest('form');
  if (form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && submitBtn.disabled) {
      e.preventDefault();
    }
  }
}, true);