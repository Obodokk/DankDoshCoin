/**
 * Логика работы FAQ страницы
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аккордеона
    initAccordion();

    // Инициализация поиска по FAQ
    initSearch();

    // Инициализация фильтрации по категориям
    initCategoryFilter();

    // Инициализация формы обратной связи
    initContactForm();
});

/**
 * Инициализирует аккордеон для вопросов/ответов
 */
function initAccordion() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.material-icons');

            // Закрываем все открытые вопросы
            if (!item.classList.contains('active')) {
                document.querySelectorAll('.faq-item').forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = null;
                    el.querySelector('.material-icons').textContent = 'expand_more';
                });
            }

            // Переключаем текущий вопрос
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = 'expand_less';
            } else {
                answer.style.maxHeight = null;
                icon.textContent = 'expand_more';
            }
        });
    });
}

/**
 * Инициализирует поиск по вопросам FAQ
 */
function initSearch() {
    const searchInput = document.getElementById('faqSearch');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const questions = document.querySelectorAll('.faq-question h3');

        questions.forEach(question => {
            const item = question.closest('.faq-item');
            const questionText = question.textContent.toLowerCase();

            if (questionText.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/**
 * Инициализирует фильтрацию вопросов по категориям
 */
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));

            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterQuestions(category);
        });
    });
}

/**
 * Фильтрует вопросы по категории
 * @param {string} category - Категория для фильтрации
 */
function filterQuestions(category) {
    const questions = document.querySelectorAll('.faq-item');

    questions.forEach(question => {
        const questionCategory = question.getAttribute('data-category');

        if (category === 'all' || questionCategory === category) {
            question.style.display = 'block';
        } else {
            question.style.display = 'none';
        }
    });
}

/**
 * Инициализирует форму обратной связи
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.querySelector('#contactName').value;
        const email = this.querySelector('#contactEmail').value;
        const question = this.querySelector('#contactQuestion').value;

        // В реальном приложении здесь будет отправка данных на сервер
        console.log('Отправка вопроса:', { name, email, question });

        // Показываем уведомление об успешной отправке
        Common.showNotification('Ваш вопрос отправлен! Мы ответим вам в ближайшее время.', 'success');

        // Очищаем форму
        this.reset();
    });
}