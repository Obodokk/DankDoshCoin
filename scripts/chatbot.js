document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, был ли уже показан чат
    if (sessionStorage.getItem('chatbotShown')) {
        initializeChatbot();
        return;
    }

    // Устанавливаем таймер на 10 секунд для первого показа
    setTimeout(function() {
        sessionStorage.setItem('chatbotShown', 'true');
        initializeChatbot();
    }, 10000);
});

function initializeChatbot() {
    // Создаем контейнер для чата
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-container';
    chatContainer.className = 'chatbot-hidden';

    // Создаем заголовок чата
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chatbot-header';
    chatHeader.innerHTML = `
        <div class="chatbot-title">
            <i class="fas fa-wine-glass-alt"></i>
            <span>Помощник wine.not.pmr</span>
        </div>
        <button id="chatbot-close" class="chatbot-close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Создаем тело чата
    const chatBody = document.createElement('div');
    chatBody.className = 'chatbot-body';
    chatBody.innerHTML = `
        <div class="chatbot-welcome">
            <div class="chatbot-message bot-message">
                Привет! Чем могу помочь?
            </div>
        </div>
        <div id="chatbot-messages" class="chatbot-messages"></div>
    `;

    // Создаем быстрые кнопки
    const quickButtons = document.createElement('div');
    quickButtons.className = 'chatbot-quick-buttons';
    quickButtons.innerHTML = `
        <button class="chatbot-quick-btn" data-question="Как сделать заказ?">Как сделать заказ?</button>
        <button class="chatbot-quick-btn" data-question="Какие виды бокалов есть?">Виды бокалов</button>
        <button class="chatbot-quick-btn" data-question="Сроки доставки">Сроки доставки</button>
        <button class="chatbot-quick-btn" data-question="Сроки изготовления">Сроки изготовления</button>
        <button class="chatbot-quick-btn" data-question="Цены на гравировку">Цены на бокалы</button>
        <button class="chatbot-quick-btn" data-question="Подарочные упаковок">Виды упаковок</button>
    `;

    // Создаем поле ввода
    const chatInput = document.createElement('div');
    chatInput.className = 'chatbot-input';
    chatInput.innerHTML = `
        <input type="text" id="chatbot-user-input" placeholder="Напишите ваш вопрос...">
        <button id="chatbot-send-btn" class="chatbot-send-btn">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;

    // Собираем все вместе
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatBody);
    chatContainer.appendChild(quickButtons);
    chatContainer.appendChild(chatInput);

    // Добавляем чат на страницу
    document.body.appendChild(chatContainer);

    // Создаем кнопку для открытия чата
    const chatToggle = document.createElement('div');
    chatToggle.id = 'chatbot-toggle';
    chatToggle.className = 'chatbot-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
    document.body.appendChild(chatToggle);

    // Показываем чат через небольшой таймер для анимации
    setTimeout(() => {
        chatContainer.classList.remove('chatbot-hidden');
        chatContainer.classList.add('chatbot-visible');
    }, 100);

    // Обработчики событий
    document.getElementById('chatbot-close').addEventListener('click', toggleChat);
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChat);
    document.getElementById('chatbot-send-btn').addEventListener('click', sendMessage);
    document.getElementById('chatbot-user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Обработчики для быстрых кнопок
    document.querySelectorAll('.chatbot-quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            addUserMessage(question);
            setTimeout(() => {
                generateBotResponse(question);
            }, 500);
        });
    });

    // Функция переключения видимости чата
    function toggleChat() {
        const isVisible = chatContainer.classList.contains('chatbot-visible');
        if (isVisible) {
            chatContainer.classList.remove('chatbot-visible');
            chatContainer.classList.add('chatbot-hidden');
            chatToggle.style.display = 'flex';
        } else {
            chatContainer.classList.remove('chatbot-hidden');
            chatContainer.classList.add('chatbot-visible');
            chatToggle.style.display = 'none';
        }
    }

    // Функция добавления сообщения пользователя
    function addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Функция добавления сообщения бота
    function addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.innerHTML = message;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Функция отправки сообщения
    function sendMessage() {
        const input = document.getElementById('chatbot-user-input');
        const message = input.value.trim();

        if (message) {
            addUserMessage(message);
            input.value = '';

            setTimeout(() => {
                generateBotResponse(message);
            }, 500);
        }
    }

    // Функция прокрутки вниз
    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Функция генерации ответа бота
    function generateBotResponse(question) {
        let response = '';
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('заказ') || lowerQuestion.includes('оформлени')) {
            response = `
                <p>Чтобы сделать заказ:</p>
                <ol>
                    <li>Выберите бокал в <a href="catalog.html">каталоге</a></li>
                    <li>Создайте дизайн в <a href="designer.html">конструкторе</a></li>
                    <li>Оформите заказ на странице <a href="order.html">оформления</a></li>
                </ol>
                <p>Или вы можете сразу перейти в <a href="designer.html">конструктор</a> и начать создавать свой уникальный дизайн!</p>
            `;
        }
        else if (lowerQuestion.includes('виды') || lowerQuestion.includes('бокал')) {
            response = `
                <p>У нас есть несколько видов бокалов:</p>
                <ul>
                    <li>🍷 Винные бокалы (420 мл)</li>
                    <li>🍺 Пивные бокалы (500 мл)</li>
                    <li>🥃 Бокалы для виски (300 мл)</li>
                    <li>🥂 Бокалы для шампанского (200 мл)</li>
                    <li>🪵 Бокалы для коньяка (350 мл)</li>
                    <li>❄️ Наборы рюмок для водки (6 шт по 50 мл)</li>
                </ul>
                <p>Посмотреть все варианты можно в <a href="catalog.html">каталоге</a>.</p>
            `;
        }
        else if (lowerQuestion.includes('доставк') || lowerQuestion.includes('срок')) {
            response = `
                <p>Сроки доставки:</p>
                <ul>
                    <li>По Тирасполю - 1-2 дня</li>
                    <li>По ПМР - 2-3 дня</li>
                    <li>По Молдове - 3-5 дней</li>
                </ul>
                <p>Мы отправляем заказы в день изготовления!</p>
            `;
        }
        else if (lowerQuestion.includes('изготовления') || lowerQuestion.includes('срок')) {
            response = `
                <p>Сроки изготовления:</p>
                <ul>
                    <li>В среднем на изготовление заказов уходит 1-3 рабочих дня</li>
                    <li>Сроки могут отличаться, все зависит от загруженности</li>
                    <li>Сроки изготовления будут уточнены для вас после оформления заказа.</li>
                </ul>
                <p>По готовности вам напишут в вашу соц-сеть, которую вы указали при оформлении заказа, или позвонят по вашему номеру телефона</p>
            `;
        }
        else if (lowerQuestion.includes('цен') || lowerQuestion.includes('стоимость')) {
            response = `
                <p>Стоимость бокалов:</p>
                <ul>
                    <li>Стоимость одного бокала - 200 руб</li>
                    <li>При заказе 2х бокалов, скидка 50 руб - 350 руб</li>
                    <li>В стоимоть входит подарочная упаковка (крафт)</li>
                    <li>Стоимость бокала в деревянном боксе - 375 руб</li>
                    <li>Стоимость 2х бокалов в деревянном боксе - 475 руб</li>
                    <li>Стоимость одного бокала + место под бутылку - 475 руб</li>
                    <li>Стоимость 2х бокалов + место под бутылку - 525 руб</li>
                    <li>Наборы рюмок в деревянном боксе - 475 руб</li>
                    <li>Можем изготовить любой бокс, под любое кол-во бокалов</li>
                    <li>Уточните в лс в нашем <a href="https://www.instagram.com/wine.not.pmr/">instagram</a></li>
                </ul>
                <p>Точную стоимость можно узнать после создания дизайна в <a href="designer.html">конструкторе</a>.</p>
            `;
        }
        else if (lowerQuestion.includes('гаранти') || lowerQuestion.includes('вернут')) {
            response = `
                <p>Мы гарантируем качество нашей продукции!</p>
                <p>Если вам что-то не понравится - мы вернем деньги или переделаем заказ.</p>
                <p>Гравировка выполняется на современном лазерном оборудовании и не стирается со временем.</p>
            `;
        }
        else if (lowerQuestion.includes('стирается') || lowerQuestion.includes('вернут')) {
            response = `
                <p>Мы гарантируем качество нашей продукции!</p>
                <p>Если вам что-то не понравится - мы вернем деньги или переделаем заказ.</p>
                <p>Гравировка выполняется на современном лазерном оборудовании и не стирается со временем.</p>
            `;
        }
        else if (lowerQuestion.includes('подар') || lowerQuestion.includes('упаковк')) {
            response = `
                <p>Все наши бокалы поставляются в красивой подарочной упаковке:</p>
                <ul>
                    <li>Картонные коробки с логотипом</li>
                    <li>Деревянные боксы (опционально)</li>
                    <li>Подарочные пакеты (опционально)</li>
                </ul>
                <p>Вы можете добавить подарочную упаковку при оформлении заказа.</p>
                <p>Примеры упаковки можно посмотреть в <a href="gallery.html">галерее</a>.</p>
            `;
        }

        else {
            response = `
                <p>Извините, я не совсем понял ваш вопрос.</p>
                <p>Вы можете:</p>
                <ul>
                    <li>Посмотреть <a href="catalog.html">каталог</a> бокалов</li>
                    <li>Создать свой дизайн в <a href="designer.html">конструкторе</a></li>
                    <li>Написать нам в <a href="https://instagram.com/wine.not.pmr">Instagram</a></li>
                </ul>
                <p>Или задайте другой вопрос, я постараюсь помочь!</p>
            `;
        }

        addBotMessage(response);
    }
}