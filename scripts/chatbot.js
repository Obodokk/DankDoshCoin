// chatbot.js - Чат-бот для сайта wine.not.pmr

// Создаем элемент script для динамической загрузки
const loadChatbotScript = function() {
  const script = document.createElement('script');
  script.src = 'scripts/chatbot.js';
  script.async = true;
  document.body.appendChild(script);
};

// Проверяем, загружен ли DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

function initChatbot() {
  const chatbot = {
    isOpen: false,
    messages: [],
    questions: [
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
    ],
    currentQuestion: 0,
    sessionId: null,
    timerStarted: false,

    init: function() {
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
    },

    createUI: function() {
      const container = document.createElement('div');
      container.id = 'chatbot-container';
      
      // Используем createElement вместо innerHTML для CSP compliance
      const header = document.createElement('div');
      header.id = 'chatbot-header';
      
      const avatar = document.createElement('div');
      avatar.className = 'chatbot-avatar';
      const avatarImg = document.createElement('img');
      avatarImg.src = 'images/chatbot-avatar.png';
      avatarImg.alt = 'Помощник';
      avatar.appendChild(avatarImg);
      
      const info = document.createElement('div');
      info.className = 'chatbot-info';
      const title = document.createElement('h3');
      title.textContent = 'Помощник по выбору';
      const subtitle = document.createElement('p');
      subtitle.textContent = 'Я помогу вам выбрать идеальный бокал';
      info.appendChild(title);
      info.appendChild(subtitle);
      
      const closeBtn = document.createElement('button');
      closeBtn.id = 'chatbot-close';
      closeBtn.textContent = '×';
      
      header.appendChild(avatar);
      header.appendChild(info);
      header.appendChild(closeBtn);
      
      const messages = document.createElement('div');
      messages.id = 'chatbot-messages';
      
      const input = document.createElement('div');
      input.id = 'chatbot-input';
      
      const options = document.createElement('div');
      options.id = 'chatbot-options';
      
      const startBtn = document.createElement('button');
      startBtn.id = 'chatbot-start';
      startBtn.className = 'btn chatbot-btn';
      startBtn.innerHTML = '<i class="fas fa-comments"></i> Начать выбор';
      
      input.appendChild(options);
      input.appendChild(startBtn);
      
      const minimized = document.createElement('div');
      minimized.className = 'chatbot-minimized';
      
      const minimizedContent = document.createElement('div');
      minimizedContent.className = 'chatbot-minimized-content';
      const minimizedImg = document.createElement('img');
      minimizedImg.src = 'images/chatbot-avatar.png';
      minimizedImg.alt = 'Помощник';
      const minimizedText = document.createElement('span');
      minimizedText.textContent = 'Нужна помощь?';
      
      minimizedContent.appendChild(minimizedImg);
      minimizedContent.appendChild(minimizedText);
      minimized.appendChild(minimizedContent);
      
      container.appendChild(header);
      container.appendChild(messages);
      container.appendChild(input);
      container.appendChild(minimized);
      
      document.body.appendChild(container);
      
      if (localStorage.getItem('chatbotClosed')) {
        container.classList.add('minimized');
      }
    },

    addEventListeners: function() {
      document.getElementById('chatbot-close').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleChat(false);
        localStorage.setItem('chatbotClosed', 'true');
        this.saveState();
      });

      document.getElementById('chatbot-start').addEventListener('click', () => {
        this.startConversation();
      });
      
      document.querySelector('#chatbot-container .chatbot-minimized').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleChat(true);
        localStorage.removeItem('chatbotClosed');
        this.saveState();
      });
    },

    toggleChat: function(open = !this.isOpen) {
      this.isOpen = open;
      const container = document.getElementById('chatbot-container');
      
      if (open) {
        container.classList.remove('minimized');
        container.style.transform = 'translateY(0)';
      } else {
        container.classList.add('minimized');
        container.style.transform = 'translateY(calc(100% - 60px))';
      }
      
      this.saveState();
    },

    startConversation: function() {
      document.getElementById('chatbot-start').style.display = 'none';
      this.askQuestion(0);
      this.saveState();
    },

    askQuestion: function(index) {
      if (index >= this.questions.length) {
        this.showRecommendation();
        this.saveState();
        return;
      }

      this.currentQuestion = index;
      const question = this.questions[index];
      this.addMessage(question.text, 'bot');

      const optionsContainer = document.getElementById('chatbot-options');
      optionsContainer.innerHTML = '';

      question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'chatbot-option';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          this.addMessage(option, 'user');
          setTimeout(() => this.askQuestion(index + 1), 500);
          this.saveState();
        });
        optionsContainer.appendChild(btn);
      });
      
      this.saveState();
    },

    addMessage: function(text, sender) {
      this.messages.push({ text, sender });
      this.renderMessages();
      this.saveState();
    },
    
    renderMessages: function() {
      const messagesContainer = document.getElementById('chatbot-messages');
      messagesContainer.innerHTML = '';
      
      this.messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${msg.sender}`;
        
        if (msg.sender === 'bot') {
          const avatar = document.createElement('div');
          avatar.className = 'chatbot-avatar';
          const avatarImg = document.createElement('img');
          avatarImg.src = 'images/chatbot-avatar.png';
          avatarImg.alt = 'Помощник';
          avatar.appendChild(avatarImg);
          
          const content = document.createElement('div');
          content.className = 'message-content';
          content.textContent = msg.text;
          
          messageElement.appendChild(avatar);
          messageElement.appendChild(content);
        } else {
          const content = document.createElement('div');
          content.className = 'message-content';
          content.textContent = msg.text;
          
          const avatar = document.createElement('div');
          avatar.className = 'chatbot-avatar';
          const avatarImg = document.createElement('img');
          avatarImg.src = 'images/user-avatar.png';
          avatarImg.alt = 'Вы';
          avatar.appendChild(avatarImg);
          
          messageElement.appendChild(content);
          messageElement.appendChild(avatar);
        }
        
        messagesContainer.appendChild(messageElement);
      });
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    showRecommendation: function() {
      const recommendation = "Рекомендуем вам создать индивидуальный дизайн в нашем конструкторе!";
      this.addMessage(recommendation, 'bot');

      const optionsContainer = document.getElementById('chatbot-options');
      optionsContainer.innerHTML = '';

      const btn = document.createElement('button');
      btn.className = 'chatbot-option primary';
      const icon = document.createElement('i');
      icon.className = 'fas fa-pen-fancy';
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(' Перейти в конструктор'));
      btn.addEventListener('click', () => {
        window.location.href = 'designer.html';
      });
      optionsContainer.appendChild(btn);
      
      this.saveState();
    },
    
    saveState: function() {
      const state = {
        isOpen: this.isOpen,
        messages: this.messages,
        currentQuestion: this.currentQuestion
      };
      localStorage.setItem(`chatbotState_${this.sessionId}`, JSON.stringify(state));
    }
  };

  chatbot.init();
}

// Загружаем скрипт после проверки CSP
try {
  initChatbot();
} catch (e) {
  console.log('Chatbot init error, trying dynamic load', e);
  loadChatbotScript();
}