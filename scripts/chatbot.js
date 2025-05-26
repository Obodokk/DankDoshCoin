// chatbot.js - Чат-бот для сайта wine.not.pmr
// Создаем элемент script для дин
// Основной класс чат-бота
// scripts/chatbot.js - Полностью рабочий чат-бот с исправленными ошибками

class GlassBotAssistant {
  constructor() {
    // Проверка на дублирование
    if (document.getElementById('glassbot-container')) {
      return;
    }

    // Состояние бота
    this.isOpen = false;
    this.messages = [];
    this.currentQuestion = 0;
    this.botTyping = false;
    this.sessionId = null;
    this.timerStarted = false;

    // DOM элементы
    this.container = null;
    this.messagesContainer = null;
    this.optionsContainer = null;
    this.startButton = null;
    this.minimizedPanel = null;
    this.closeButton = null;

    // Вопросы бота
    this.questions = [
      {
        text: "Какой тип бокала вас интересует?",
        options: ["🍷 Винный", "🍺 Пивной", "🥃 Виски", "🥂 Шампанское", "🪵 Коньяк", "❄️ Водка"]
      },
      {
        text: "Какой стиль гравировки предпочитаете?",
        options: ["Классический", "Современный", "Романтический", "Юмористический", "Персонализированный"]
      },
      {
        text: "Это будет подарок?",
        options: ["Да", "Нет"]
      }
    ];

    this.init();
  }

  init() {
    this.createUI();
    this.setupEventListeners();
    this.setupSession();
    this.checkAutoOpen();
  }

  createUI() {
    // Основной контейнер
    this.container = document.createElement('div');
    this.container.id = 'glassbot-container';
    this.container.className = 'minimized';

    // Шапка чата
    const header = document.createElement('div');
    header.className = 'glassbot-header';

    const avatar = this.createAvatar('images/chatbot-avatar.png', 'Помощник');
    const info = this.createInfo('Помощник по выбору', 'Я помогу вам выбрать идеальный бокал');
    
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'glassbot-close';
    this.closeButton.innerHTML = '&times;';

    header.appendChild(avatar);
    header.appendChild(info);
    header.appendChild(this.closeButton);

    // Тело чата
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'glassbot-messages';

    // Панель ввода
    const inputPanel = document.createElement('div');
    inputPanel.className = 'glassbot-input';

    this.optionsContainer = document.createElement('div');
    this.optionsContainer.className = 'glassbot-options';

    this.startButton = document.createElement('button');
    this.startButton.className = 'glassbot-start-btn';
    this.startButton.textContent = 'Начать выбор';

    inputPanel.appendChild(this.optionsContainer);
    inputPanel.appendChild(this.startButton);

    // Минимизированная панель
    this.minimizedPanel = document.createElement('div');
    this.minimizedPanel.className = 'glassbot-minimized';
    
    const minimizedContent = document.createElement('div');
    minimizedContent.className = 'glassbot-minimized-content';
    
    const minimizedAvatar = this.createAvatar('images/chatbot-avatar.png', 'Помощник');
    const minimizedText = document.createElement('span');
    minimizedText.textContent = 'Нужна помощь?';
    
    minimizedContent.appendChild(minimizedAvatar);
    minimizedContent.appendChild(minimizedText);
    this.minimizedPanel.appendChild(minimizedContent);

    // Собираем все вместе
    this.container.appendChild(header);
    this.container.appendChild(this.messagesContainer);
    this.container.appendChild(inputPanel);
    this.container.appendChild(this.minimizedPanel);

    document.body.appendChild(this.container);
  }

  createAvatar(src, alt) {
    const avatar = document.createElement('div');
    avatar.className = 'glassbot-avatar';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40NzYgMiAyIDYuNDc2IDIgMTJzNC40NzYgMTAgMTAgMTAgMTAtNC40NzYgMTAtMTBTMTcuNTI0IDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjwvc3ZnPg==';
    };
    
    avatar.appendChild(img);
    return avatar;
  }

  createInfo(title, subtitle) {
    const info = document.createElement('div');
    info.className = 'glassbot-info';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    
    const subtitleEl = document.createElement('p');
    subtitleEl.textContent = subtitle;
    
    info.appendChild(titleEl);
    info.appendChild(subtitleEl);
    return info;
  }

  setupEventListeners() {
    // Обработчик для кнопки закрытия
    this.closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeChat();
    });

    // Обработчик для кнопки старта
    this.startButton.addEventListener('click', () => {
      this.startConversation();
    });
    
    // Обработчик для минимизированной панели
    this.minimizedPanel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openChat();
    });
  }

  setupSession() {
    this.sessionId = localStorage.getItem('glassbotSessionId') || 'session-' + Date.now();
    localStorage.setItem('glassbotSessionId', this.sessionId);
    this.loadState();
  }

  checkAutoOpen() {
    const chatbotShown = sessionStorage.getItem(`glassbotShown_${this.sessionId}`);
    
    if (!chatbotShown && !this.timerStarted) {
      this.timerStarted = true;
      setTimeout(() => {
        if (!this.isOpen && !localStorage.getItem('glassbotClosed')) {
          this.openChat();
          sessionStorage.setItem(`glassbotShown_${this.sessionId}`, 'true');
        }
      }, 10000);
    }
  }

  openChat() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.container.classList.remove('minimized');
    localStorage.removeItem('glassbotClosed');
    this.saveState();
    
    // Прокручиваем к последнему сообщению
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  closeChat() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.container.classList.add('minimized');
    localStorage.setItem('glassbotClosed', 'true');
    this.saveState();
  }

  startConversation() {
    this.startButton.style.display = 'none';
    this.addMessage("Здравствуйте! Я помогу вам создать идеальный бокал с гравировкой.", 'bot');
    setTimeout(() => this.askQuestion(0), 1000);
  }

  askQuestion(index) {
    if (index >= this.questions.length) {
      this.showRecommendation();
      return;
    }

    this.currentQuestion = index;
    const question = this.questions[index];
    
    this.botTyping = true;
    this.typeMessage(question.text, 'bot', () => {
      this.botTyping = false;
      this.showOptions(question.options);
    });
  }

  typeMessage(text, sender, callback) {
    let i = 0;
    const message = { text: '', sender };
    this.messages.push(message);
    this.renderMessages();

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        message.text += text.charAt(i);
        this.renderMessages();
        i++;
      } else {
        clearInterval(typingInterval);
        if (callback) callback();
      }
    }, 30);
  }

  showOptions(options) {
    this.optionsContainer.innerHTML = '';

    options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'glassbot-option';
      btn.textContent = option;
      
      btn.addEventListener('click', () => {
        this.addMessage(option, 'user');
        setTimeout(() => this.askQuestion(this.currentQuestion + 1), 500);
      });
      
      // Небольшая задержка для анимации появления кнопок
      setTimeout(() => {
        this.optionsContainer.appendChild(btn);
      }, i * 100);
    });
  }

  addMessage(text, sender) {
    if (this.botTyping) return;
    
    this.messages.push({ text, sender });
    this.renderMessages();
    this.saveState();
  }
  
  renderMessages() {
    this.messagesContainer.innerHTML = '';
    
    this.messages.forEach(msg => {
      const messageElement = document.createElement('div');
      messageElement.className = `glassbot-message ${msg.sender}`;
      
      if (msg.sender === 'bot') {
        const avatar = this.createAvatar('images/chatbot-avatar.png', 'Помощник');
        const content = document.createElement('div');
        content.className = 'glassbot-message-content';
        content.textContent = msg.text;
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
      } else {
        const content = document.createElement('div');
        content.className = 'glassbot-message-content';
        content.textContent = msg.text;
        
        const avatar = this.createAvatar('images/user-avatar.png', 'Вы');
        
        messageElement.appendChild(content);
        messageElement.appendChild(avatar);
      }
      
      this.messagesContainer.appendChild(messageElement);
    });
    
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showRecommendation() {
    this.typeMessage("Рекомендуем вам создать индивидуальный дизайн в нашем конструкторе!", 'bot', () => {
      this.optionsContainer.innerHTML = '';

      const btn = document.createElement('button');
      btn.className = 'glassbot-option primary';
      btn.innerHTML = '<i class="fas fa-pen-fancy"></i> Перейти в конструктор';
      
      btn.addEventListener('click', () => {
        window.location.href = 'designer.html';
      });
      
      this.optionsContainer.appendChild(btn);
    });
  }

  loadState() {
    const savedState = localStorage.getItem(`glassbotState_${this.sessionId}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      this.messages = state.messages || [];
      this.currentQuestion = state.currentQuestion || 0;
      
      if (state.isOpen) {
        this.openChat();
        this.renderMessages();
        
        if (this.currentQuestion < this.questions.length && this.messages.length > 0) {
          setTimeout(() => this.askQuestion(this.currentQuestion), 500);
        }
      }
    }
  }

  saveState() {
    const state = {
      isOpen: this.isOpen,
      messages: this.messages,
      currentQuestion: this.currentQuestion
    };
    localStorage.setItem(`glassbotState_${this.sessionId}`, JSON.stringify(state));
  }
}

// Инициализация бота после полной загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
  new GlassBotAssistant();
});
});
