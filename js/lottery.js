// lottery.js - Улучшенная система покупки лотерейных билетов с уведомлениями

document.addEventListener('DOMContentLoaded', function() {
  // ===================== КОНФИГУРАЦИЯ =====================
  const CONFIG = {
    TICKET_PRICE: 10,          // Цена билета в USDT
    MAX_TICKETS: 100,           // Максимальное количество билетов за одну покупку
    BASE_WIN_CHANCE: 0.8,       // Базовый шанс на выигрыш (0.8% за билет)
    MAX_WIN_CHANCE: 95,         // Максимальный шанс на выигрыш (95%)
    MIN_MATIC_BALANCE: 0.1,     // Минимальный баланс MATIC для газа
    CONTRACT_ADDRESS: '0x...',  // Адрес контракта лотереи (ЗАМЕНИТЕ НА СВОЙ)
    USDT_ADDRESS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT на Polygon
    GAS_LIMIT: 300000           // Лимит газа для транзакций
  };

  // ===================== DOM ЭЛЕМЕНТЫ =====================
  const DOM = {
    ticketOptions: document.querySelectorAll('.ticket-option'),
    customTicketInput: document.getElementById('customTicketCount'),
    setCustomTicketsBtn: document.getElementById('setCustomTickets'),
    totalAmount: document.getElementById('totalAmount'),
    buyTicketsBtn: document.getElementById('buyTicketsBtn'),
    chanceBar: document.getElementById('chanceBar'),
    chanceText: document.getElementById('chanceText'),
    userTicketCount: document.getElementById('userTicketCount'),
    jackpotAmount: document.querySelector('.current-jackpot')
  };

  // ===================== СОСТОЯНИЕ =====================
  const state = {
    selectedTickets: 0,         // Выбранное количество билетов
    isProcessing: false,        // Флаг выполнения транзакции
    userTickets: 0,             // Купленные билеты пользователя
    jackpot: 0                  // Текущий джекпот
  };

  // ===================== ИНИЦИАЛИЗАЦИЯ =====================
  init();

  function init() {
    setupStyles();              // Добавляем стили для уведомлений
    setupEventListeners();      // Настраиваем обработчики событий
    loadInitialData();          // Загружаем начальные данные
    updateUI();                 // Обновляем интерфейс
  }

  // ===================== СТИЛИ ДЛЯ УВЕДОМЛЕНИЙ =====================
  function setupStyles() {
    if (document.getElementById('lottery-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'lottery-notification-styles';
    style.textContent = `
      /* Стили для уведомлений */
      .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 90%;
        backdrop-filter: blur(10px);
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        animation: notificationSlideUp 0.3s ease forwards;
      }

      .notification.show {
        bottom: 30px;
        opacity: 1;
      }

      .notification i {
        font-size: 20px;
      }

      .notification.success {
        background: rgba(76, 175, 80, 0.9);
        color: white;
        border-left: 4px solid #4CAF50;
      }

      .notification.error {
        background: rgba(244, 67, 54, 0.9);
        color: white;
        border-left: 4px solid #F44336;
      }

      .notification.warning {
        background: rgba(255, 152, 0, 0.9);
        color: white;
        border-left: 4px solid #FF9800;
      }

      .notification.info {
        background: rgba(33, 150, 243, 0.9);
        color: white;
        border-left: 4px solid #2196F3;
      }

      .notification a {
        color: white;
        text-decoration: underline;
        font-weight: bold;
        margin-left: 5px;
      }

      .notification a:hover {
        text-decoration: none;
      }

      @keyframes notificationSlideUp {
        from {
          transform: translate(-50%, 20px);
          opacity: 0;
        }
        to {
          transform: translate(-50%, 0);
          opacity: 1;
        }
      }

      /* Адаптив для мобильных */
      @media (max-width: 768px) {
        .notification {
          width: 90%;
          padding: 12px 15px;
          font-size: 14px;
        }
        .notification i {
          font-size: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ===================== ОБРАБОТЧИКИ СОБЫТИЙ =====================
  function setupEventListeners() {
    // Кнопки выбора билетов
    DOM.ticketOptions.forEach(option => {
      option.addEventListener('click', () => handleTicketOptionClick(option));
    });

    // Кастомный ввод билетов
    DOM.setCustomTicketsBtn.addEventListener('click', handleCustomTickets);
    DOM.customTicketInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCustomTickets();
    });

    // Кнопка покупки
    DOM.buyTicketsBtn.addEventListener('click', handleTicketPurchase);

    // События кошелька и языка
    window.addEventListener('walletChanged', loadUserTickets);
    window.addEventListener('languageChanged', updateUITexts);
  }

  // ===================== ОСНОВНАЯ ЛОГИКА =====================

  // Обработчик выбора билетов
  function handleTicketOptionClick(option) {
    const ticketCount = parseInt(option.dataset.count);
    if (isNaN(ticketCount)) return;

    state.selectedTickets = ticketCount;
    DOM.customTicketInput.value = '';
    updateSelectionUI(option);
    updateUI();
  }

  // Обработчик кастомного ввода
  function handleCustomTickets() {
    const customCount = parseInt(DOM.customTicketInput.value);

    if (!customCount || customCount < 1) {
      showNotification('Пожалуйста, введите число от 1 до 100', 'warning');
      return;
    }

    if (customCount > CONFIG.MAX_TICKETS) {
      showNotification(`Максимально можно купить ${CONFIG.MAX_TICKETS} билетов`, 'warning');
      return;
    }

    state.selectedTickets = customCount;
    DOM.ticketOptions.forEach(btn => btn.classList.remove('active'));
    updateUI();
  }

  // Основная функция покупки
  async function handleTicketPurchase() {
    if (state.isProcessing) return;

    try {
      state.isProcessing = true;
      setLoadingState(true);

      // 1. Проверки перед покупкой
      await prePurchaseChecks();

      // 2. Проверка и подтверждение USDT
      const allowance = await checkUSDTAllowance();
      if (allowance < state.selectedTickets * CONFIG.TICKET_PRICE) {
        await approveUSDT();
      }

      // 3. Покупка билетов
      const txHash = await buyTicketsContract();

      // 4. Успешная покупка
      await handlePurchaseSuccess(txHash);
    } catch (error) {
      handlePurchaseError(error);
    } finally {
      state.isProcessing = false;
      setLoadingState(false);
    }
  }

  // ===================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====================

  // Проверки перед покупкой
  async function prePurchaseChecks() {
    if (!window.walletManager?.currentAccount) {
      throw new Error('Пожалуйста, подключите кошелек');
    }

    await window.walletManager.checkNetwork();

    if (state.selectedTickets < 1 || state.selectedTickets > CONFIG.MAX_TICKETS) {
      throw new Error(`Выберите от 1 до ${CONFIG.MAX_TICKETS} билетов`);
    }

    const hasMinBalance = await window.walletManager.checkMinimumBalance(CONFIG.MIN_MATIC_BALANCE);
    if (!hasMinBalance) {
      throw new Error(`Нужно минимум ${CONFIG.MIN_MATIC_BALANCE} MATIC для газа`);
    }
  }

  // Проверка разрешения USDT
  async function checkUSDTAllowance() {
    const usdtContract = new window.walletManager.web3.eth.Contract(
      ERC20_ABI,
      CONFIG.USDT_ADDRESS
    );

    const allowance = await usdtContract.methods
      .allowance(window.walletManager.currentAccount, CONFIG.CONTRACT_ADDRESS)
      .call();

    return window.walletManager.web3.utils.fromWei(allowance, 'ether');
  }

  // Подтверждение USDT
  async function approveUSDT() {
    const amount = state.selectedTickets * CONFIG.TICKET_PRICE;
    const amountWei = window.walletManager.web3.utils.toWei(amount.toString(), 'ether');

    const usdtContract = new window.walletManager.web3.eth.Contract(
      ERC20_ABI,
      CONFIG.USDT_ADDRESS
    );

    try {
      showNotification('Подтверждаем использование USDT...', 'info');

      const tx = await usdtContract.methods
        .approve(CONFIG.CONTRACT_ADDRESS, amountWei)
        .send({ from: window.walletManager.currentAccount, gas: CONFIG.GAS_LIMIT });

      showNotification('USDT подтверждены!', 'success');
      return tx;
    } catch (error) {
      console.error('Ошибка подтверждения:', error);
      throw new Error('Не удалось подтвердить USDT');
    }
  }

  // Покупка билетов через контракт
  async function buyTicketsContract() {
    const contract = new window.walletManager.web3.eth.Contract(
      LOTTERY_ABI,
      CONFIG.CONTRACT_ADDRESS
    );

    try {
      showNotification('Покупаем билеты...', 'info');

      const tx = await contract.methods
        .buyTickets(state.selectedTickets)
        .send({ from: window.walletManager.currentAccount, gas: CONFIG.GAS_LIMIT });

      return tx.transactionHash;
    } catch (error) {
      console.error('Ошибка покупки:', error);
      throw new Error('Не удалось купить билеты');
    }
  }

  // Успешная покупка
  async function handlePurchaseSuccess(txHash) {
    await loadUserTickets();

    const txLink = `${window.walletManager.POLYGON_CHAIN.blockExplorer}/tx/${txHash}`;
    showNotification(
      `Успешно куплено ${state.selectedTickets} билетов! ` +
      `<a href="${txLink}" target="_blank">Посмотреть транзакцию</a>`,
      'success'
    );

    createConfetti();
    resetSelection();
    await loadJackpot();
  }

  // Обработка ошибок
  function handlePurchaseError(error) {
    let message = 'Ошибка покупки';

    if (error.message.includes('denied')) {
      message = 'Транзакция отклонена пользователем';
    } else if (error.message.includes('insufficient')) {
      message = 'Недостаточно средств для транзакции';
    } else if (error.message.includes('network')) {
      message = 'Пожалуйста, переключитесь на сеть Polygon';
    } else {
      message = error.message || message;
    }

    showNotification(message, 'error');
    console.error('Ошибка:', error);
  }

  // ===================== УВЕДОМЛЕНИЯ =====================
  function showNotification(message, type = 'info', isHTML = false) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    if (isHTML) {
      notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
      `;
    } else {
      const icon = document.createElement('i');
      icon.className = `fas ${getNotificationIcon(type)}`;

      const text = document.createElement('span');
      text.textContent = message;

      notification.append(icon, text);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

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

  // ===================== РАБОТА С ДАННЫМИ =====================
  async function loadUserTickets() {
    if (!window.walletManager?.currentAccount) {
      state.userTickets = 0;
      updateUI();
      return;
    }

    try {
      const contract = new window.walletManager.web3.eth.Contract(
        LOTTERY_ABI,
        CONFIG.CONTRACT_ADDRESS
      );

      const tickets = await contract.methods
        .getUserTickets(window.walletManager.currentAccount)
        .call();

      state.userTickets = parseInt(tickets);
      updateUI();
    } catch (error) {
      console.error('Ошибка загрузки билетов:', error);
      state.userTickets = 0;
      updateUI();
    }
  }

  async function loadJackpot() {
    try {
      const contract = new window.walletManager.web3.eth.Contract(
        LOTTERY_ABI,
        CONFIG.CONTRACT_ADDRESS
      );

      const jackpot = await contract.methods.currentJackpot().call();
      state.jackpot = window.walletManager.web3.utils.fromWei(jackpot, 'ether');

      if (DOM.jackpotAmount) {
        DOM.jackpotAmount.textContent = `${parseFloat(state.jackpot).toLocaleString('ru-RU')} USDT`;
      }
    } catch (error) {
      console.error('Ошибка загрузки джекпота:', error);
    }
  }

  // ===================== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====================
  function updateUI() {
    updatePurchaseUI();
    updateChanceUI();
    updateUserTicketsUI();
  }

  function updatePurchaseUI() {
    const totalCost = state.selectedTickets * CONFIG.TICKET_PRICE;
    DOM.totalAmount.textContent = `${totalCost} USDT`;
  }

  function updateChanceUI() {
    const totalTickets = state.userTickets + state.selectedTickets;
    const chance = Math.min(totalTickets * CONFIG.BASE_WIN_CHANCE, CONFIG.MAX_WIN_CHANCE);
    DOM.chanceBar.style.width = `${chance}%`;
    DOM.chanceText.textContent = `${chance.toFixed(1)}%`;
  }

  function updateUserTicketsUI() {
    DOM.userTicketCount.textContent = state.userTickets;
  }

  function updateUITexts() {
    if (DOM.buyTicketsBtn) {
      DOM.buyTicketsBtn.textContent = state.isProcessing ? 'Обработка...' : 'Купить билеты';
    }
  }

  function updateSelectionUI(selectedOption) {
    DOM.ticketOptions.forEach(btn => btn.classList.remove('active'));
    if (selectedOption) selectedOption.classList.add('active');
  }

  // ===================== UI ПОМОЩНИКИ =====================
  function setLoadingState(isLoading) {
    DOM.buyTicketsBtn.disabled = isLoading;

    if (isLoading) {
      DOM.buyTicketsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
    } else {
      DOM.buyTicketsBtn.textContent = 'Купить билеты';
    }
  }

  function resetSelection() {
    state.selectedTickets = 0;
    DOM.customTicketInput.value = '';
    DOM.ticketOptions.forEach(btn => btn.classList.remove('active'));
    updateUI();
  }

  function createConfetti() {
    const colors = ['#6e45e2', '#88d3ce', '#ff9a9e', '#fad0c4', '#a18cd1'];
    const container = document.createElement('div');
    container.className = 'confetti-container';

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(confetti);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
  }
});

// ===================== ABI КОНТРАКТОВ =====================
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_spender","type": "address"},
      {"name": "_value","type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "","type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner","type": "address"},
      {"name": "_spender","type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "","type": "uint256"}],
    "type": "function"
  }
];

const LOTTERY_ABI = [
  {
    "inputs": [
      {"internalType": "uint256","name": "ticketCount","type": "uint256"}
    ],
    "name": "buyTickets",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "user","type": "address"}
    ],
    "name": "getUserTickets",
    "outputs": [
      {"internalType": "uint256","name": "","type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentJackpot",
    "outputs": [
      {"internalType": "uint256","name": "","type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];