/**
 * Логика работы FAQ (аккордеон, поиск, форма обратной связи)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аккордеона
    initAccordion();

    // Инициализация поиска
    initSearch();

    // Инициализация формы обратной связи
    initContactForm();
});

/**
 * Инициализация аккордеона
 */
function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.toggle-icon').textContent = '+';
                }
            });

            // Переключаем текущий элемент
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            const toggleIcon = item.querySelector('.toggle-icon');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggleIcon.textContent = '-';
            } else {
                answer.style.maxHeight = '0';
                toggleIcon.textContent = '+';
            }
        });
    });
}

/**
 * Инициализация поиска по вопросам
 */
function initSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchButton = document.getElementById('searchFaqBtn');
    const faqItems = document.querySelectorAll('.faq-item');

    if (!searchInput || !searchButton) return;

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            // Показываем все вопросы, если поиск пустой
            faqItems.forEach(item => {
                item.style.display = '';
            });
            return;
        }

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
                // Раскрываем найденные вопросы
                item.classList.add('active');
                item.querySelector('.faq-answer').style.maxHeight = item.querySelector('.faq-answer').scrollHeight + 'px';
                item.querySelector('.toggle-icon').textContent = '-';
            } else {
                item.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchButton.addEventListener('click', performSearch);
}

/**
 * Инициализация формы обратной связи
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const question = form.querySelector('textarea[name="question"]').value.trim();

        // Простая валидация
        if (!name || !email || !question) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        // Проверка email
        if (!validateEmail(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        // Здесь должна быть отправка формы на сервер
        // Для демонстрации просто показываем уведомление
        showNotification('Ваш вопрос отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
    });
}

/**
 * Валидация email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}