// chatbot.js - Чат-бот для сайта wine.not.pmr

// Создаем элемент script для дин
// chatbot.js - Полностью переработанная версия с исправлением CSP и новыми функциями

// Основной класс чат-бота
class GlassBot {
  constructor() {
    // Проверка на дублирование
    if (document.getElementById('chatbot-container')) return;
    
    this.isOpen = false;
    this.messages = [];
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
    this.currentQuestion = 0;
    this.sessionId = null;
    this.timerStarted = false;
    this.botTyping = false;

    this.init();
  }

  init() {
    this.sessionId = localStorage.getItem('chatbotSessionId') || 'session-' + Date.now();
    localStorage.setItem('chatbotSessionId', this.sessionId);
    
    this.createUI();
    this.addEventListeners();

    const chatbotShown = sessionStorage.getItem(`chatbotShown_${this.sessionId}`);
    
    if (!chatbotShown && !this.timerStarted) {
      this.timerStarted = true;
      setTimeout(() => {
        if (!this.isOpen && !localStorage.getItem('chatbotClosed')) {
          this.toggleChat(true);
          sessionStorage.setItem(`chatbotShown_${this.sessionId}`, 'true');
        }
      }, 10000);
    }
    
    this.loadState();
  }

  createUI() {
    // Создаем контейнер чата
    this.container = document.createElement('div');
    this.container.id = 'chatbot-container';
    this.container.className = 'minimized';

    // Шапка чата
    const header = document.createElement('div');
    header.id = 'chatbot-header';

    const avatar = this.createAvatar('images/chatbot-avatar.png', 'Помощник');
    const info = this.createInfo('Помощник по выбору', 'Я помогу вам выбрать идеальный бокал');
    this.closeBtn = this.createCloseButton();

    header.appendChild(avatar);
    header.appendChild(info);
    header.appendChild(this.closeBtn);

    // Тело чата
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.id = 'chatbot-messages';

    // Нижняя панель
    const inputPanel = document.createElement('div');
    inputPanel.id = 'chatbot-input';

    this.optionsContainer = document.createElement('div');
    this.optionsContainer.id = 'chatbot-options';

    this.startBtn = document.createElement('button');
    this.startBtn.id = 'chatbot-start';
    this.startBtn.className = 'btn chatbot-btn';
    this.startBtn.innerHTML = '<i class="fas fa-comments"></i> Начать выбор';

    inputPanel.appendChild(this.optionsContainer);
    inputPanel.appendChild(this.startBtn);

    // Минимизированная панель
    this.minimizedPanel = document.createElement('div');
    this.minimizedPanel.className = 'chatbot-minimized';
    
    const minimizedContent = document.createElement('div');
    minimizedContent.className = 'chatbot-minimized-content';
    
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
    avatar.className = 'chatbot-avatar';
    
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
    info.className = 'chatbot-info';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    
    const subtitleEl = document.createElement('p');
    subtitleEl.textContent = subtitle;
    
    info.appendChild(titleEl);
    info.appendChild(subtitleEl);
    return info;
  }

  createCloseButton() {
    const btn = document.createElement('button');
    btn.id = 'chatbot-close';
    btn.textContent = '×';
    return btn;
  }

  addEventListeners() {
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleChat(false);
      localStorage.setItem('chatbotClosed', 'true');
      this.saveState();
    });

    this.startBtn.addEventListener('click', () => {
      this.startConversation();
    });
    
    this.minimizedPanel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleChat(true);
      localStorage.removeItem('chatbotClosed');
      this.saveState();
    });
  }

  toggleChat(open = !this.isOpen) {
    this.isOpen = open;
    
    if (open) {
      this.container.classList.remove('minimized');
      this.container.style.transform = 'translateY(0)';
    } else {
      this.container.classList.add('minimized');
      this.container.style.transform = 'translateY(calc(100% - 60px))';
    }
    
    this.saveState();
  }

  startConversation() {
    this.startBtn.style.display = 'none';
    this.askQuestion(0);
  }

  askQuestion(index) {
    if (index >= this.questions.length) {
      this.showRecommendation();
      return;
    }

    this.currentQuestion = index;
    const question = this.questions[index];
    
    // Эффект печатания
    this.botTyping = true;
    this.typeMessage(question.text, 'bot', () => {
      this.botTyping = false;
      this.showOptions(question.options);
    });
  }

  typeMessage(text, sender, callback) {
    let i = 0;
    const typingSpeed = 30; // Скорость печати (мс на символ)
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
    }, typingSpeed);
  }

  showOptions(options) {
    this.optionsContainer.innerHTML = '';

    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        this.addMessage(option, 'user');
        setTimeout(() => this.askQuestion(this.currentQuestion + 1), 500);
      });
      this.optionsContainer.appendChild(btn);
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
      messageElement.className = `chatbot-message ${msg.sender}`;
      
      if (msg.sender === 'bot') {
        const avatar = this.createAvatar('images/chatbot-avatar.png', 'Помощник');
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = msg.text;
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
      } else {
        const content = document.createElement('div');
        content.className = 'message-content';
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
      btn.className = 'chatbot-option primary';
      
      const icon = document.createElement('i');
      icon.className = 'fas fa-pen-fancy';
      
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(' Перейти в конструктор'));
      
      btn.addEventListener('click', () => {
        window.location.href = 'designer.html';
      });
      
      this.optionsContainer.appendChild(btn);
    });
  }

  loadState() {
    const savedState = localStorage.getItem(`chatbotState_${this.sessionId}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      this.messages = state.messages || [];
      this.currentQuestion = state.currentQuestion || 0;
      
      if (state.isOpen) {
        this.toggleChat(true);
        this.renderMessages();
        
        if (this.currentQuestion < this.questions.length && this.messages.length > 0) {
          this.askQuestion(this.currentQuestion);
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
    localStorage.setItem(`chatbotState_${this.sessionId}`, JSON.stringify(state));
  }
}

// Инициализация чат-бота после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  new GlassBot();
});
