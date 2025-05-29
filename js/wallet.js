/**
 * Полная реализация подключения кошельков с поддержкой EIP-6963
 * Поддерживает: MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, Binance Chain Wallet
 * Автоматически определяет доступные провайдеры и позволяет выбрать нужный
 */

// Конфигурация WalletConnect
const WALLET_CONNECT_PROJECT_ID = 'ВАШ_PROJECT_ID'; // Замените на реальный ID проекта
const WALLET_CONNECT_METADATA = {
  name: 'CryptoFortune',
  description: 'Криптолотерея нового поколения',
  url: window.location.href,
  icons: ['https://ваш-сайт.com/logo.png']
};

// Поддерживаемые кошельки и их настройки
const SUPPORTED_WALLETS = {
  metamask: {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'icons/metamask.svg',
    check: () => Boolean(window.ethereum?.isMetaMask),
    connect: async () => connectViaEthereum('metamask')
  },
  walletconnect: {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'icons/walletconnect.png',
    check: () => true, // Всегда доступен
    connect: async () => connectViaWalletConnect()
  },
  coinbase: {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'icons/coinbase.png',
    check: () => Boolean(window.ethereum?.isCoinbaseWallet),
    connect: async () => connectViaEthereum('coinbase')
  },
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    icon: 'icons/trust.png',
    check: () => Boolean(window.ethereum?.isTrust),
    connect: async () => connectViaEthereum('trust')
  },
  binance: {
    id: 'binance',
    name: 'Binance Chain Wallet',
    icon: 'icons/binance.png',
    check: () => Boolean(window.BinanceChain),
    connect: async () => connectViaBinance()
  }
};

// Текущий подключенный провайдер
let currentProvider = null;
let currentWalletId = null;
let walletConnectConnector = null;

// ======================
// Основные функции
// ======================

/**
 * Инициализация системы кошельков
 */
function initWallet() {
  setupConnectButton();
  setupDisconnectButton();
  checkSavedConnection();
}

/**
 * Показать модальное окно с выбором кошелька
 */
async function showWalletModal() {
  const availableWallets = await detectAvailableWallets();
  renderWalletModal(availableWallets);
}

/**
 * Подключение выбранного кошелька
 * @param {string} walletId - ID кошелька из SUPPORTED_WALLETS
 */
async function connectWallet(walletId) {
  const wallet = SUPPORTED_WALLETS[walletId];
  if (!wallet) {
    showNotification('Выбранный кошелек не поддерживается', 'error');
    return;
  }

  try {
    // Показываем индикатор загрузки
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.innerHTML = '<span class="loading-spinner"></span> Подключение...';
    }

    // Подключаем кошелек
    const address = await wallet.connect();

    if (!address) {
      throw new Error('Не удалось получить адрес кошелька');
    }

    // Проверяем сеть (должна быть Polygon)
    await checkAndSwitchNetwork();

    // Сохраняем подключение
    saveConnectedWallet(walletId, address);
    updateWalletUI(address, wallet.name);

    showNotification(`${wallet.name} успешно подключен`, 'success');
  } catch (error) {
    console.error('Ошибка подключения кошелька:', error);
    showNotification(`Ошибка подключения: ${error.message}`, 'error');
  } finally {
    // Восстанавливаем кнопку
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
      connectBtn.disabled = false;
      connectBtn.textContent = 'Подключить кошелек';
    }
  }
}

/**
 * Отключение текущего кошелька
 */
function disconnectWallet() {
  // Закрываем соединение WalletConnect если активно
  if (walletConnectConnector) {
    walletConnectConnector.killSession();
    walletConnectConnector = null;
  }

  // Очищаем сохраненные данные
  localStorage.removeItem('connectedWallet');
  localStorage.removeItem('walletId');

  // Сбрасываем состояние
  currentProvider = null;
  currentWalletId = null;

  // Обновляем UI
  document.getElementById('connectWalletBtn').style.display = 'block';
  document.getElementById('walletInfo').style.display = 'none';

  showNotification('Кошелек отключен', 'info');
}

// ======================
// Обнаружение кошельков
// ======================

/**
 * Обнаружение доступных кошельков с поддержкой EIP-6963
 * @returns {Promise<Array>} Массив доступных кошельков
 */
async function detectAvailableWallets() {
  // 1. Обнаруживаем через EIP-6963
  const eip6963Providers = await detectEIP6963Providers();

  // 2. Обнаруживаем legacy-провайдеры
  const legacyProviders = detectLegacyProviders();

  // 3. Объединяем результаты, устраняя дубликаты
  const mergedProviders = mergeProviders(eip6963Providers, legacyProviders);

  // 4. Добавляем WalletConnect (всегда доступен)
  mergedProviders.push({
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: SUPPORTED_WALLETS.walletconnect.icon,
    provider: null
  });

  return mergedProviders;
}

/**
 * Обнаружение провайдеров через EIP-6963
 */
async function detectEIP6963Providers() {
  return new Promise((resolve) => {
    const providers = [];

    const handler = (event) => {
      const { info, provider } = event.detail;

      // Проверяем, поддерживается ли этот кошелек
      const supportedWallet = Object.values(SUPPORTED_WALLETS).find(
        wallet => wallet.name.toLowerCase() === info.name.toLowerCase()
      );

      if (supportedWallet) {
        providers.push({
          id: supportedWallet.id,
          name: info.name,
          icon: info.icon || supportedWallet.icon,
          provider,
          rdns: info.rdns
        });
      }
    };

    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Даем время на обработку событий
    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', handler);
      resolve(providers);
    }, 300);
  });
}

/**
 * Обнаружение legacy-провайдеров (window.ethereum и др.)
 */
function detectLegacyProviders() {
  const providers = [];

  // Обнаружение через window.ethereum
  if (window.ethereum) {
    // Множественные провайдеры (например, MetaMask + Coinbase)
    if (window.ethereum.providers) {
      window.ethereum.providers.forEach(provider => {
        if (provider.isMetaMask) {
          providers.push({
            id: 'metamask',
            name: 'MetaMask',
            icon: SUPPORTED_WALLETS.metamask.icon,
            provider
          });
        }
        if (provider.isCoinbaseWallet) {
          providers.push({
            id: 'coinbase',
            name: 'Coinbase Wallet',
            icon: SUPPORTED_WALLETS.coinbase.icon,
            provider
          });
        }
        if (provider.isTrust) {
          providers.push({
            id: 'trust',
            name: 'Trust Wallet',
            icon: SUPPORTED_WALLETS.trust.icon,
            provider
          });
        }
      });
    } else {
      // Одиночный провайдер
      if (window.ethereum.isMetaMask) {
        providers.push({
          id: 'metamask',
          name: 'MetaMask',
          icon: SUPPORTED_WALLETS.metamask.icon,
          provider: window.ethereum
        });
      }
      if (window.ethereum.isCoinbaseWallet) {
        providers.push({
          id: 'coinbase',
          name: 'Coinbase Wallet',
          icon: SUPPORTED_WALLETS.coinbase.icon,
          provider: window.ethereum
        });
      }
      if (window.ethereum.isTrust) {
        providers.push({
          id: 'trust',
          name: 'Trust Wallet',
          icon: SUPPORTED_WALLETS.trust.icon,
          provider: window.ethereum
        });
      }
    }
  }

  // Binance Chain Wallet
  if (window.BinanceChain) {
    providers.push({
      id: 'binance',
      name: 'Binance Chain Wallet',
      icon: SUPPORTED_WALLETS.binance.icon,
      provider: window.BinanceChain
    });
  }

  return providers;
}

/**
 * Объединение списков провайдеров с дедупликацией
 */
function mergeProviders(eip6963Providers, legacyProviders) {
  const merged = [];
  const addedIds = new Set();

  // Сначала добавляем EIP-6963 провайдеры
  eip6963Providers.forEach(provider => {
    if (!addedIds.has(provider.id)) {
      merged.push(provider);
      addedIds.add(provider.id);
    }
  });

  // Затем добавляем legacy-провайдеры, если их еще нет
  legacyProviders.forEach(provider => {
    if (!addedIds.has(provider.id)) {
      merged.push(provider);
      addedIds.add(provider.id);
    }
  });

  return merged;
}

// ======================
// Методы подключения
// ======================

/**
 * Подключение через Ethereum-провайдер (MetaMask, Coinbase и т.д.)
 * @param {string} walletId - ID кошелька
 */
async function connectViaEthereum(walletId) {
  const wallet = SUPPORTED_WALLETS[walletId];
  if (!wallet) throw new Error('Кошелек не поддерживается');

  try {
    // Получаем провайдер
    let provider;

    // Для EIP-6963
    if (currentProvider && currentProvider.rdns) {
      provider = currentProvider;
    }
    // Для legacy-провайдеров
    else {
      if (walletId === 'metamask' && window.ethereum?.isMetaMask) {
        provider = window.ethereum;
      } else if (walletId === 'coinbase' && window.ethereum?.isCoinbaseWallet) {
        provider = window.ethereum;
      } else if (walletId === 'trust' && window.ethereum?.isTrust) {
        provider = window.ethereum;
      } else {
        throw new Error('Провайдер не обнаружен');
      }
    }

    // Запрашиваем аккаунты
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('Не удалось получить аккаунты');
    }

    // Сохраняем текущий провайдер
    currentProvider = provider;
    currentWalletId = walletId;

    return accounts[0];
  } catch (error) {
    console.error('Ошибка подключения Ethereum-кошелька:', error);
    throw error;
  }
}

/**
 * Подключение через WalletConnect
 */
async function connectViaWalletConnect() {
  try {
    // Инициализируем коннектор
    const { WalletConnect } = await import('@walletconnect/client');
    const { QRCodeModal } = await import('@walletconnect/qrcode-modal');

    walletConnectConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
      clientMeta: WALLET_CONNECT_METADATA
    });

    // Проверяем, есть ли активная сессия
    if (!walletConnectConnector.connected) {
      // Создаем новую сессию
      await walletConnectConnector.createSession();
    }

    // Ждем подключения
    return new Promise((resolve, reject) => {
      walletConnectConnector.on("connect", (error, payload) => {
        if (error) {
          reject(error);
          return;
        }

        const { accounts } = payload.params[0];
        if (accounts && accounts.length > 0) {
          currentProvider = walletConnectConnector;
          currentWalletId = 'walletconnect';
          resolve(accounts[0]);
        } else {
          reject(new Error('Не удалось получить аккаунты'));
        }
      });

      walletConnectConnector.on("session_update", (error) => {
        if (error) {
          reject(error);
        }
      });

      walletConnectConnector.on("disconnect", (error) => {
        if (error) {
          reject(error);
        }
        disconnectWallet();
      });
    });
  } catch (error) {
    console.error('Ошибка подключения WalletConnect:', error);
    throw error;
  }
}

/**
 * Подключение через Binance Chain Wallet
 */
async function connectViaBinance() {
  try {
    if (!window.BinanceChain) {
      throw new Error('Binance Chain Wallet не обнаружен');
    }

    const accounts = await window.BinanceChain.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('Не удалось получить аккаунты');
    }

    currentProvider = window.BinanceChain;
    currentWalletId = 'binance';

    return accounts[0];
  } catch (error) {
    console.error('Ошибка подключения Binance Chain Wallet:', error);
    throw error;
  }
}

// ======================
// Работа с сетями
// ======================

/**
 * Проверка и переключение на сеть Polygon
 */
async function checkAndSwitchNetwork() {
  if (!currentProvider) {
    throw new Error('Провайдер не подключен');
  }

  const polygonChainId = '0x89'; // ID сети Polygon Mainnet
  const polygonTestnetChainId = '0x13881'; // ID сети Polygon Mumbai Testnet

  try {
    let chainId;

    // Для WalletConnect
    if (currentWalletId === 'walletconnect') {
      chainId = await currentProvider.send('eth_chainId');
    }
    // Для Binance Chain Wallet
    else if (currentWalletId === 'binance') {
      chainId = window.BinanceChain.chainId;
    }
    // Для других Ethereum-провайдеров
    else {
      chainId = await currentProvider.request({ method: 'eth_chainId' });
    }

    // Если уже подключены к Polygon, ничего не делаем
    if (chainId === polygonChainId || chainId === polygonTestnetChainId) {
      return true;
    }

    // Пытаемся переключиться на Polygon
    try {
      await currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonChainId }],
      });
      return true;
    } catch (switchError) {
      // Если сеть не добавлена в кошелек, добавляем ее
      if (switchError.code === 4902) {
        try {
          await currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: polygonChainId,
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }
            ]
          });
          return true;
        } catch (addError) {
          console.error('Ошибка добавления сети Polygon:', addError);
          throw new Error('Не удалось добавить сеть Polygon');
        }
      }
      throw new Error('Не удалось переключиться на сеть Polygon');
    }
  } catch (error) {
    console.error('Ошибка проверки сети:', error);
    throw error;
  }
}

// ======================
// Управление состоянием
// ======================

/**
 * Проверка сохраненного подключения кошелька
 */
function checkSavedConnection() {
  const savedWallet = localStorage.getItem('connectedWallet');
  const walletId = localStorage.getItem('walletId');

  if (savedWallet && walletId && SUPPORTED_WALLETS[walletId]) {
    updateWalletUI(savedWallet, SUPPORTED_WALLETS[walletId].name);
  }
}

/**
 * Сохранение подключенного кошелька
 * @param {string} walletId - ID кошелька
 * @param {string} address - Адрес кошелька
 */
function saveConnectedWallet(walletId, address) {
  localStorage.setItem('connectedWallet', address);
  localStorage.setItem('walletId', walletId);
}

/**
 * Обновление UI после подключения кошелька
 * @param {string} address - Адрес кошелька
 * @param {string} walletName - Название кошелька
 */
function updateWalletUI(address, walletName) {
  const connectBtn = document.getElementById('connectWalletBtn');
  const walletInfo = document.getElementById('walletInfo');
  const walletAddress = document.getElementById('walletAddress');

  if (connectBtn && walletInfo && walletAddress) {
    connectBtn.style.display = 'none';
    walletInfo.style.display = 'flex';
    walletAddress.textContent = shortenAddress(address);

    // Добавляем название кошелька, если передано
    const walletConnectedText = document.querySelector('.wallet-connected');
    if (walletConnectedText && walletName) {
      walletConnectedText.textContent = `${walletName} подключен:`;
    }
  }
}

/**
 * Сокращение адреса кошелька для отображения
 * @param {string} address - Полный адрес кошелька
 * @returns {string} Сокращенный адрес (первые и последние 4 символа)
 */
function shortenAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// ======================
// UI-функции
// ======================

/**
 * Рендер модального окна выбора кошелька
 * @param {Array} wallets - Массив доступных кошельков
 */
function renderWalletModal(wallets) {
  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.className = 'wallet-modal';

  // Создаем контент модального окна
  modal.innerHTML = `
    <div class="wallet-modal-content">
      <h3>Выберите кошелек</h3>
      <div class="wallet-options" id="walletOptions"></div>
      <button class="btn btn-secondary close-modal">Закрыть</button>
    </div>
  `;

  // Добавляем варианты кошельков
  const optionsContainer = modal.querySelector('#walletOptions');

  wallets.forEach(wallet => {
    const walletConfig = SUPPORTED_WALLETS[wallet.id];
    if (!walletConfig) return;

    const option = document.createElement('div');
    option.className = 'wallet-option';
    option.innerHTML = `
      <img src="${wallet.icon || walletConfig.icon}" alt="${wallet.name}">
      <span>${wallet.name}</span>
    `;

    option.addEventListener('click', () => {
      // Для EIP-6963 сохраняем провайдер перед подключением
      if (wallet.provider) {
        currentProvider = wallet.provider;
      }
      connectWallet(wallet.id);
    });

    optionsContainer.appendChild(option);
  });

  // Добавляем обработчик закрытия модального окна
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Добавляем модальное окно на страницу
  document.body.appendChild(modal);

  // Анимация появления
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

/**
 * Настройка кнопки подключения кошелька
 */
function setupConnectButton() {
  const btn = document.getElementById('connectWalletBtn');
  if (btn) {
    btn.addEventListener('click', showWalletModal);
  }
}

/**
 * Настройка кнопки отключения кошелька
 */
function setupDisconnectButton() {
  const btn = document.getElementById('disconnectWalletBtn');
  if (btn) {
    btn.addEventListener('click', disconnectWallet);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initWallet);

// Экспортируем функции для использования в других модулях
window.wallet = {
  connectWallet,
  disconnectWallet,
  getProvider: () => currentProvider,
  getWalletId: () => currentWalletId,
  getAddress: () => localStorage.getItem('connectedWallet')
};