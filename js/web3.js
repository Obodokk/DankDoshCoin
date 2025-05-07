// web3.js - Complete Wallet Manager with USDT Balance Check

document.addEventListener('DOMContentLoaded', () => {
  class WalletManager {
    constructor() {
      // Supported wallet types
      this.WALLET_TYPES = {
        METAMASK: 'metamask',
        TRUST: 'trust',
        BINANCE: 'binance',
        COINBASE: 'coinbase'
      };

      // Polygon network parameters
      this.POLYGON_CHAIN = {
        id: '0x89',
        name: 'Polygon Mainnet',
        rpc: 'https://polygon-rpc.com',
        nativeCurrency: {
          name: 'MATIC',
          decimals: 18,
          symbol: 'MATIC'
        },
        blockExplorer: 'https://polygonscan.com'
      };

      // USDT contract on Polygon
      this.USDT_CONTRACT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
      this.USDT_ABI = [{
        "constant": true,
        "inputs": [{"name": "_owner","type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance","type": "uint256"}],
        "type": "function"
      }];

      // Current state
      this.currentWallet = null;
      this.currentAccount = null;
      this.provider = null;
      this.web3 = null;
      this.connectBtn = null;

      this.init();
    }

    /**
     * Initialize wallet manager
     */
    async init() {
      this.setupStyles();
      this.setupConnectButton();
      await this.checkPersistedConnection();
      this.setupStorageListener();
      this.setupPageLoadHandler();
    }

    /**
     * Handle page load to restore UI
     */
    setupPageLoadHandler() {
      window.addEventListener('load', () => {
        if (this.currentAccount) {
          this.updateUI();
        }
      });
    }

    /**
     * Check for persisted connection in localStorage
     */
    async checkPersistedConnection() {
      const connectionData = localStorage.getItem('walletConnection');
      if (!connectionData) return;

      try {
        const { walletType, account } = JSON.parse(connectionData);
        await this.connect(walletType);
        this.currentAccount = account;
        this.updateUI();
      } catch (error) {
        console.error('Connection restore error:', error);
        this.clearPersistedConnection();
      }
    }

    /**
     * Persist connection data to localStorage
     */
    persistConnection() {
      const connectionData = {
        walletType: this.currentWallet,
        account: this.currentAccount,
        isConnected: true,
        timestamp: Date.now()
      };
      localStorage.setItem('walletConnection', JSON.stringify(connectionData));
    }

    /**
     * Clear connection data
     */
    clearPersistedConnection() {
      localStorage.removeItem('walletConnection');
    }

    /**
     * Setup storage listener for cross-tab sync
     */
    setupStorageListener() {
      window.addEventListener('storage', (e) => {
        if (e.key === 'walletConnection') {
          if (e.newValue) {
            const data = JSON.parse(e.newValue);
            if (data.isConnected) {
              this.updateUI();
            } else {
              this.disconnectUI();
            }
          }
        }
      });
    }

    /**
     * Connect wallet by type
     */
    async connect(walletType) {
      try {
        // Clear previous connection
        if (this.currentWallet) {
          this.disconnect();
        }

        // Connect based on wallet type
        switch (walletType) {
          case this.WALLET_TYPES.METAMASK:
            await this.connectMetaMask();
            break;
          case this.WALLET_TYPES.TRUST:
            await this.connectTrustWallet();
            break;
          case this.WALLET_TYPES.BINANCE:
            await this.connectBinanceChain();
            break;
          case this.WALLET_TYPES.COINBASE:
            await this.connectCoinbase();
            break;
          default:
            throw new Error('Unsupported wallet type');
        }

        // Network check and setup
        await this.checkNetwork();
        this.setupEventListeners();
        this.persistConnection();
        this.updateUI();
        this.showNotification('Wallet connected successfully', 'success');
      } catch (error) {
        console.error(`Connection error (${walletType}):`, error);
        this.showNotification(`Connection failed: ${error.message}`, 'error');
        throw error;
      }
    }

    /**
     * Connect MetaMask
     */
    async connectMetaMask() {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
      if (!window.ethereum.isMetaMask) {
        throw new Error('Please use MetaMask');
      }

      this.provider = window.ethereum;
      this.web3 = new Web3(this.provider);
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });

      this.currentAccount = accounts[0];
      this.currentWallet = this.WALLET_TYPES.METAMASK;
    }

    /**
     * Connect Trust Wallet
     */
    async connectTrustWallet() {
      // Through injected provider
      if (window.ethereum?.isTrust) {
        this.provider = window.ethereum;
        this.web3 = new Web3(this.provider);
        const accounts = await this.provider.request({
          method: 'eth_requestAccounts'
        });
        this.currentAccount = accounts[0];
        this.currentWallet = this.WALLET_TYPES.TRUST;
        return;
      }

      // Through WalletConnect
      if (typeof WalletConnect !== 'undefined') {
        const connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org",
          qrcodeModal: QRCodeModal
        });

        if (!connector.connected) {
          await connector.createSession();
        }

        connector.on("connect", (error, payload) => {
          if (error) throw error;

          const { accounts } = payload.params[0];
          this.currentAccount = accounts[0];
          this.currentWallet = this.WALLET_TYPES.TRUST;
          this.provider = connector;
          this.web3 = new Web3(connector);
          this.updateUI();
        });

        return;
      }

      throw new Error('Trust Wallet not available');
    }

    /**
     * Connect Binance Chain Wallet
     */
    async connectBinanceChain() {
      if (!window.BinanceChain) {
        throw new Error('Binance Chain Wallet not installed');
      }

      try {
        const accounts = await window.BinanceChain.request({
          method: 'eth_requestAccounts'
        });
        this.provider = window.BinanceChain;
        this.web3 = new Web3(this.provider);
        this.currentAccount = accounts[0];
        this.currentWallet = this.WALLET_TYPES.BINANCE;
      } catch (error) {
        throw new Error('User denied connection');
      }
    }

    /**
     * Connect Coinbase Wallet
     */
    async connectCoinbase() {
      // Browser extension
      if (window.coinbaseWalletExtension) {
        this.provider = window.coinbaseWalletExtension;
        this.web3 = new Web3(this.provider);
        const accounts = await this.provider.request({
          method: 'eth_requestAccounts'
        });
        this.currentAccount = accounts[0];
        this.currentWallet = this.WALLET_TYPES.COINBASE;
        return;
      }

      // Through WalletLink
      if (typeof WalletLink !== 'undefined') {
        const walletLink = new WalletLink({
          appName: "CryptoLotto",
          appLogoUrl: "https://yourdomain.com/logo.png"
        });

        const provider = walletLink.makeWeb3Provider(
          this.POLYGON_CHAIN.rpc,
          parseInt(this.POLYGON_CHAIN.id)
        );

        await provider.send('eth_requestAccounts');
        this.provider = provider;
        this.web3 = new Web3(provider);
        this.currentAccount = (await this.web3.eth.getAccounts())[0];
        this.currentWallet = this.WALLET_TYPES.COINBASE;
        return;
      }

      throw new Error('Coinbase Wallet not available');
    }

    /**
     * Check USDT balance
     */
    async checkUSDTBalance(minAmount) {
      if (!this.web3 || !this.currentAccount) {
        throw new Error('Wallet not connected');
      }

      const contract = new this.web3.eth.Contract(
        this.USDT_ABI,
        this.USDT_CONTRACT
      );

      const balance = await contract.methods
        .balanceOf(this.currentAccount)
        .call();

      const balanceInUSDT = this.web3.utils.fromWei(balance, 'ether');

      if (parseFloat(balanceInUSDT) < minAmount) {
        throw new Error(`Insufficient USDT balance. Minimum required: ${minAmount} USDT`);
      }

      return parseFloat(balanceInUSDT);
    }

    /**
     * Check MATIC balance for gas
     */
    async checkMATICBalance(minAmount = 0.1) {
      if (!this.web3 || !this.currentAccount) {
        throw new Error('Wallet not connected');
      }

      const balance = await this.web3.eth.getBalance(this.currentAccount);
      const balanceInMATIC = this.web3.utils.fromWei(balance, 'ether');

      if (parseFloat(balanceInMATIC) < minAmount) {
        throw new Error(`Insufficient MATIC for gas. Minimum required: ${minAmount} MATIC`);
      }

      return parseFloat(balanceInMATIC);
    }

    /**
     * Check network
     */
    async checkNetwork() {
      if (!this.web3) return;

      const chainId = await this.web3.eth.getChainId();
      if (chainId !== parseInt(this.POLYGON_CHAIN.id)) {
        try {
          await this.switchToPolygon();
        } catch (error) {
          this.showNotification('Please switch to Polygon network', 'warning');
          throw error;
        }
      }
    }

    /**
     * Switch to Polygon network
     */
    async switchToPolygon() {
      if (this.currentWallet === this.WALLET_TYPES.METAMASK ||
          this.currentWallet === this.WALLET_TYPES.BINANCE) {
        try {
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: this.POLYGON_CHAIN.id }]
          });
        } catch (switchError) {
          // If network not added, try to add it
          await this.addPolygonNetwork();
        }
      }
      // Other wallets switch automatically
    }

    /**
     * Add Polygon network to wallet
     */
    async addPolygonNetwork() {
      try {
        await this.provider.request({
          method: 'wallet_addEthereumChain',
          params: [this.POLYGON_CHAIN]
        });
      } catch (addError) {
        this.showNotification('Failed to add Polygon network', 'error');
        throw addError;
      }
    }

    /**
     * Setup wallet event listeners
     */
    setupEventListeners() {
      if (!this.provider) return;

      // For MetaMask and Binance Chain
      if (this.currentWallet === this.WALLET_TYPES.METAMASK ||
          this.currentWallet === this.WALLET_TYPES.BINANCE) {
        this.provider.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            this.disconnect();
          } else {
            this.currentAccount = accounts[0];
            this.persistConnection();
            this.updateUI();
            window.dispatchEvent(new Event('walletChanged'));
          }
        });

        this.provider.on('chainChanged', () => {
          window.location.reload();
        });
      }

      // For Trust Wallet via WalletConnect
      if (this.currentWallet === this.WALLET_TYPES.TRUST && this.provider.on) {
        this.provider.on('disconnect', () => {
          this.disconnect();
        });
      }
    }

    /**
     * Setup connect button
     */
    setupConnectButton() {
      this.connectBtn = document.getElementById('connectWalletBtn');
      if (!this.connectBtn) return;

      this.connectBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (this.currentAccount) {
          this.showWalletMenu();
        } else {
          this.showWalletModal();
        }
      });

      // Restore button state on load
      if (localStorage.getItem('walletConnection')) {
        this.updateUI();
      }
    }

    /**
     * Show wallet selection modal
     */
    showWalletModal() {
      this.removeModal();
      this.removeMenu();

      const modal = document.createElement('div');
      modal.className = 'wallet-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>Select Wallet</h3>
          <button class="wallet-option" data-wallet="${this.WALLET_TYPES.METAMASK}">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask"
            <span>MetaMask</span>
          </button>
          <button class="wallet-option" data-wallet="${this.WALLET_TYPES.TRUST}">
            <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" alt="Trust Wallet">
            <span>Trust Wallet</span>
          </button>
          <button class="wallet-option" data-wallet="${this.WALLET_TYPES.BINANCE}">
            <img src="https://bin.bnbstatic.com/static/images/common/favicon.ico" alt="Binance Chain">
            <span>Binance Chain</span>
          </button>
          <button class="wallet-option" data-wallet="${this.WALLET_TYPES.COINBASE}">
            <img src="https://www.coinbase.com/favicon.ico" alt="Coinbase">
            <span>Coinbase Wallet</span>
          </button>
        </div>
      `;

      modal.querySelectorAll('.wallet-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const walletType = btn.dataset.wallet;
          modal.remove();
          this.connect(walletType).catch(() => {
            // Error already handled in connect()
          });
        });
      });

      document.body.appendChild(modal);
    }

    /**
     * Show wallet management menu
     */
    showWalletMenu() {
      this.removeMenu();
      this.removeModal();

      const menu = document.createElement('div');
      menu.className = 'wallet-menu';

      const shortAddress = `${this.currentAccount.substring(0, 6)}...${this.currentAccount.substring(38)}`;

      menu.innerHTML = `
        <div class="wallet-info">
          <span>Connected via ${this.getWalletName(this.currentWallet)}</span>
          <span class="wallet-address">${shortAddress}</span>
        </div>
        <button class="menu-btn copy-btn">
          <i class="fas fa-copy"></i> Copy Address
        </button>
        <button class="menu-btn disconnect-btn">
          <i class="fas fa-sign-out-alt"></i> Disconnect
        </button>
      `;

      const rect = this.connectBtn.getBoundingClientRect();
      menu.style.top = `${rect.bottom + 5}px`;
      menu.style.left = `${rect.left}px`;

      // Copy address
      menu.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(this.currentAccount);
        this.showNotification('Address copied', 'success');
        menu.remove();
      });

      // Disconnect
      menu.querySelector('.disconnect-btn').addEventListener('click', () => {
        this.disconnect();
        menu.remove();
      });

      document.body.appendChild(menu);

      // Close menu when clicking outside
      setTimeout(() => {
        const clickHandler = (e) => {
          if (!menu.contains(e.target) && e.target !== this.connectBtn) {
            menu.remove();
            document.removeEventListener('click', clickHandler);
          }
        };
        document.addEventListener('click', clickHandler);
      }, 100);
    }

    /**
     * Disconnect wallet
     */
    disconnect() {
      if (this.currentWallet === this.WALLET_TYPES.TRUST && this.provider.disconnect) {
        this.provider.disconnect();
      }

      this.currentWallet = null;
      this.currentAccount = null;
      this.provider = null;
      this.web3 = null;

      this.clearPersistedConnection();
      this.disconnectUI();
      this.showNotification('Wallet disconnected', 'info');
    }

    /**
     * Update UI when connected
     */
    updateUI() {
      if (!this.connectBtn) return;

      if (this.currentAccount) {
        const shortAddress = `${this.currentAccount.substring(0, 6)}...${this.currentAccount.substring(38)}`;
        this.connectBtn.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>${shortAddress}</span>
          <i class="fas fa-chevron-down"></i>
        `;
        this.connectBtn.classList.add('connected');
      } else {
        this.disconnectUI();
      }
    }

    /**
     * Update UI when disconnected
     */
    disconnectUI() {
      if (!this.connectBtn) return;
      this.connectBtn.innerHTML = `
        <i class="fas fa-wallet"></i>
        <span>Connect Wallet</span>
      `;
      this.connectBtn.classList.remove('connected');
    }

    /**
     * Get wallet display name
     */
    getWalletName(walletType) {
      const names = {
        [this.WALLET_TYPES.METAMASK]: 'MetaMask',
        [this.WALLET_TYPES.TRUST]: 'Trust Wallet',
        [this.WALLET_TYPES.BINANCE]: 'Binance Chain',
        [this.WALLET_TYPES.COINBASE]: 'Coinbase Wallet'
      };
      return names[walletType] || 'Wallet';
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
      const existing = document.querySelector('.notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <i class="fas ${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      `;

      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add('show'), 10);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }

    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
      const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
      };
      return icons[type] || 'fa-info-circle';
    }

    /**
     * Remove wallet modal
     */
    removeModal() {
      const existing = document.querySelector('.wallet-modal');
      if (existing) existing.remove();
    }

    /**
     * Remove wallet menu
     */
    removeMenu() {
      const existing = document.querySelector('.wallet-menu');
      if (existing) existing.remove();
    }

    /**
     * Setup CSS styles
     */
    setupStyles() {
      if (document.getElementById('wallet-styles')) return;

      const style = document.createElement('style');
      style.id = 'wallet-styles';
      style.textContent = `
        /* Wallet modal styles */
        .wallet-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        
        .wallet-modal .modal-content {
          background: var(--card-bg);
          padding: 20px;
          border-radius: var(--radius);
          width: 300px;
          max-width: 90%;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          animation: fadeIn 0.3s ease;
        }
        
        .wallet-modal h3 {
          margin-bottom: 15px;
          text-align: center;
          color: var(--text);
        }
        
        .wallet-option {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 15px;
          margin: 8px 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          font-size: 16px;
        }
        
        .wallet-option:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
          border-color: var(--primary);
        }
        
        .wallet-option img {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          object-fit: contain;
        }
        
        /* Connected button styles */
        #connectWalletBtn.connected {
          background: var(--success);
        }
        
        /* Wallet menu styles */
        .wallet-menu {
          position: fixed;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 15px;
          z-index: 1001;
          box-shadow: var(--shadow);
          min-width: 200px;
          animation: fadeIn 0.2s ease;
        }
        
        .wallet-info {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.4;
          color: var(--text-light);
        }
        
        .wallet-address {
          font-family: monospace;
          color: var(--text);
          font-size: 13px;
          word-break: break-all;
          display: block;
          margin-top: 5px;
        }
        
        .menu-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          margin: 4px 0;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          border-radius: 4px;
          font-size: 14px;
        }
        
        .menu-btn:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .menu-btn i {
          width: 18px;
          text-align: center;
        }
        
        .copy-btn {
          color: var(--primary);
        }
        
        .disconnect-btn {
          color: var(--danger);
        }

        /* Notification styles */
        .notification {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 15px 25px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10000;
          opacity: 0;
          transition: all 0.3s ease;
          max-width: 90%;
          backdrop-filter: blur(10px);
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize when Web3 is available
  if (typeof Web3 !== 'undefined') {
    window.walletManager = new WalletManager();
  } else {
    console.error('Web3 not loaded');
    // Optionally load Web3 from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/web3@1.7.3/dist/web3.min.js';
    script.onload = () => window.walletManager = new WalletManager();
    document.head.appendChild(script);
  }
});