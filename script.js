const gameState = {
    balance: 0,
    totalEarned: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 0.5,
    lastEnergyUpdate: Date.now(),
    clickPower: 1,
    multiClick: 1,
    combo: 0,
    maxCombo: 0,
    lastClickTime: 0,
    comboTimeout: 2000,
    botLevel: 0,
    botCoins: 0,
    botProgress: 0,
    botStartTime: 0,
    botCycleTime: 12 * 60 * 60 * 1000,
    dailyCollected: false,
    lastDailyCollected: 0,
    language: 'en',
    referralCode: generateReferralCode(),
    referredBy: null,
    referrals: [],
    referralBonusReceived: [],
    upgrades: {
        clickPower: { level: 0, price: 10, multiplier: 1.15 },
        energyCapacity: { level: 0, price: 25, multiplier: 1.2 },
        energyRegen: { level: 0, price: 50, multiplier: 1.15 },
        multiClick: { level: 0, price: 100, multiplier: 1.25 },
        comboTime: { level: 0, price: 150, multiplier: 1.2 },
        comboMultiplier: { level: 0, price: 200, multiplier: 1.15 },
        botLevel: { level: 0, price: 500, multiplier: 1.3 }
    },
    achievements: {}
};

const translations = {
    en: {
        balance: "Balance:",
        energy: "Energy:",
        upgradesTitle: "⚡ Upgrades",
        achievementsTitle: "🏆 Achievements",
        referralsTitle: "👥 Referrals",
        dailyTitle: "🎁 Daily Reward",
        yourCode: "Your code:",
        copy: "Copy",
        referralsCount: "Referrals:",
        earnedFromRefs: "Earned from referrals:",
        referralBonuses: "Referral Bonuses:",
        nextReward: "Next reward in:",
        rewardAmount: "Reward amount:",
        claim: "Claim",
        level: "Level",
        buy: "Buy",
        upgradeNames: {
            clickPower: "Click Power",
            energyCapacity: "Energy Capacity",
            energyRegen: "Energy Regen",
            multiClick: "Multi-Click",
            comboTime: "Combo Time",
            comboMultiplier: "Combo Multiplier",
            botLevel: "Bot Level"
        },
        achievementNames: {
            firstClick: "First Click",
            hundredClicks: "100 Clicks",
            thousandClicks: "1,000 Clicks",
            tenThousandClicks: "10,000 Clicks",
            firstUpgrade: "First Upgrade",
            fiveUpgrades: "5 Upgrades",
            tenUpgrades: "10 Upgrades",
            firstReferral: "First Referral",
            fiveReferrals: "5 Referrals",
            tenReferrals: "10 Referrals",
            dailyCollector: "Daily Collector",
            weekOfDailies: "Week of Dailies",
            monthOfDailies: "Month of Dailies",
            energySaver: "Energy Saver",
            clickMaster: "Click Master",
            comboKing: "Combo King",
            botFarmer: "Bot Farmer",
            rich: "Rich",
            millionaire: "Millionaire",
            referralMaster: "Referral Master",
            upgradeMaster: "Upgrade Master",
            achievementHunter: "Achievement Hunter",
            allAchievements: "All Achievements"
        },
        achievementDescriptions: {
            firstClick: "Click the coin for the first time",
            hundredClicks: "Click the coin 100 times",
            thousandClicks: "Click the coin 1,000 times",
            tenThousandClicks: "Click the coin 10,000 times",
            firstUpgrade: "Buy your first upgrade",
            fiveUpgrades: "Buy 5 upgrades",
            tenUpgrades: "Buy 10 upgrades",
            firstReferral: "Invite your first friend",
            fiveReferrals: "Invite 5 friends",
            tenReferrals: "Invite 10 friends",
            dailyCollector: "Collect your first daily reward",
            weekOfDailies: "Collect daily rewards for 7 days",
            monthOfDailies: "Collect daily rewards for 30 days",
            energySaver: "Have full energy for 1 hour",
            clickMaster: "Reach 100 clicks in one combo",
            comboKing: "Reach a 50 combo",
            botFarmer: "Unlock the bot",
            rich: "Reach 10,000 coins",
            millionaire: "Reach 1,000,000 coins",
            referralMaster: "Earn 10,000 from referrals",
            upgradeMaster: "Max out one upgrade",
            achievementHunter: "Unlock 10 achievements",
            allAchievements: "Unlock all achievements"
        }
    },
    ru: {
        balance: "Баланс:",
        energy: "Энергия:",
        upgradesTitle: "⚡ Улучшения",
        achievementsTitle: "🏆 Достижения",
        referralsTitle: "👥 Рефералы",
        dailyTitle: "🎁 Ежедневная награда",
        yourCode: "Ваш код:",
        copy: "Копировать",
        referralsCount: "Рефералов:",
        earnedFromRefs: "Заработано с рефералов:",
        referralBonuses: "Реферальные бонусы:",
        nextReward: "Следующая награда через:",
        rewardAmount: "Размер награды:",
        claim: "Получить",
        level: "Уровень",
        buy: "Купить",
        upgradeNames: {
            clickPower: "Сила клика",
            energyCapacity: "Емкость энергии",
            energyRegen: "Регенерация энергии",
            multiClick: "Мульти-клик",
            comboTime: "Время комбо",
            comboMultiplier: "Множитель комбо",
            botLevel: "Уровень бота"
        },
        achievementNames: {
            firstClick: "Первый клик",
            hundredClicks: "100 кликов",
            thousandClicks: "1,000 кликов",
            tenThousandClicks: "10,000 кликов",
            firstUpgrade: "Первое улучшение",
            fiveUpgrades: "5 улучшений",
            tenUpgrades: "10 улучшений",
            firstReferral: "Первый реферал",
            fiveReferrals: "5 рефералов",
            tenReferrals: "10 рефералов",
            dailyCollector: "Первая ежедневная награда",
            weekOfDailies: "Неделя ежедневных наград",
            monthOfDailies: "Месяц ежедневных наград",
            energySaver: "Полная энергия 1 час",
            clickMaster: "100 кликов в одном комбо",
            comboKing: "Комбо из 50 кликов",
            botFarmer: "Разблокируйте бота",
            rich: "10,000 монет",
            millionaire: "1,000,000 монет",
            referralMaster: "Заработайте 10,000 с рефералов",
            upgradeMaster: "Макс. уровень улучшения",
            achievementHunter: "10 достижений",
            allAchievements: "Все достижения"
        },
        achievementDescriptions: {
            firstClick: "Кликните по монете первый раз",
            hundredClicks: "Кликните по монете 100 раз",
            thousandClicks: "Кликните по монете 1,000 раз",
            tenThousandClicks: "Кликните по монете 10,000 раз",
            firstUpgrade: "Купите первое улучшение",
            fiveUpgrades: "Купите 5 улучшений",
            tenUpgrades: "Купите 10 улучшений",
            firstReferral: "Пригласите первого друга",
            fiveReferrals: "Пригласите 5 друзей",
            tenReferrals: "Пригласите 10 друзей",
            dailyCollector: "Получите первую ежедневную награду",
            weekOfDailies: "Получайте награды 7 дней подряд",
            monthOfDailies: "Получайте награды 30 дней подряд",
            energySaver: "Имейте полную энергию 1 час",
            clickMaster: "Сделайте 100 кликов в одном комбо",
            comboKing: "Сделайте комбо из 50 кликов",
            botFarmer: "Разблокируйте бота",
            rich: "Накопите 10,000 монет",
            millionaire: "Накопите 1,000,000 монет",
            referralMaster: "Заработайте 10,000 с рефералов",
            upgradeMaster: "Максимально улучшите один параметр",
            achievementHunter: "Разблокируйте 10 достижений",
            allAchievements: "Разблокируйте все достижения"
        }
    }
};

function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function initGame() {
    loadGame();
    setupEventListeners();
    updateUI();
    startGameLoop();
    initAchievements();
    checkDailyReward();
    updateBotProgress();
}

function loadGame() {
    const savedGame = localStorage.getItem('dankDoshSave');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        Object.assign(gameState, parsed);

        if (gameState.botLevel > 0 && gameState.botStartTime > 0) {
            const timePassed = Date.now() - gameState.botStartTime;
            if (timePassed >= gameState.botCycleTime) {
                const cycles = Math.floor(timePassed / gameState.botCycleTime);
                gameState.botCoins += cycles * calculateBotCoins();
                gameState.botStartTime += cycles * gameState.botCycleTime;
                gameState.botProgress = (Date.now() - gameState.botStartTime) / gameState.botCycleTime * 100;
            } else {
                gameState.botProgress = timePassed / gameState.botCycleTime * 100;
            }
        }
    }
}

function saveGame() {
    localStorage.setItem('dankDoshSave', JSON.stringify(gameState));
}

function setupEventListeners() {
    const coin = document.getElementById('main-coin');
    coin.addEventListener('touchstart', handleCoinClick, { passive: true });
    coin.addEventListener('mousedown', handleCoinClick);

    document.getElementById('nav-main').addEventListener('click', () => showTab('main'));
    document.getElementById('nav-upgrades').addEventListener('click', () => showTab('upgrades'));
    document.getElementById('nav-achievements').addEventListener('click', () => showTab('achievements'));
    document.getElementById('nav-referrals').addEventListener('click', () => showTab('referrals'));
    document.getElementById('nav-daily').addEventListener('click', () => showTab('daily'));
    document.getElementById('language-btn').addEventListener('click', toggleLanguage);

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.getElementById('nav-main').classList.add('active');
        });
    });

    document.getElementById('collect-bot').addEventListener('click', collectBotCoins);
    document.getElementById('claim-daily').addEventListener('click', claimDailyReward);
    document.getElementById('copy-referral').addEventListener('click', copyReferralCode);
}

function handleCoinClick(e) {
    e.preventDefault();

    if (gameState.energy <= 0) {
        showPopup(translations[gameState.language].energy + " 0", 1000);
        return;
    }

    const coin = document.getElementById('main-coin');
    coin.classList.add('click-animation');
    setTimeout(() => coin.classList.remove('click-animation'), 100);

    const now = Date.now();
    if (now - gameState.lastClickTime < gameState.comboTimeout) {
        gameState.combo++;
        if (gameState.combo > gameState.maxCombo) {
            gameState.maxCombo = gameState.combo;
        }
    } else {
        gameState.combo = 0;
    }
    gameState.lastClickTime = now;

    const comboMultiplier = 1 + (gameState.combo * 0.01 * (1 + gameState.upgrades.comboMultiplier.level * 0.1));
    const coinsEarned = gameState.clickPower * gameState.multiClick * comboMultiplier;

    gameState.balance += coinsEarned;
    gameState.totalEarned += coinsEarned;
    gameState.energy = Math.max(0, gameState.energy - 1);

    createCoinPopup(coinsEarned, e);
    updateUI();
    checkClickAchievements();
    saveGame();
}

function createCoinPopup(amount, e) {
    const popupContainer = document.getElementById('popup-container');
    const popup = document.createElement('div');
    popup.className = 'coin-popup';
    popup.textContent = `+${Math.floor(amount)}`;

    const rect = e.target.getBoundingClientRect();
    let x, y;

    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    popupContainer.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function updateUI() {
    document.getElementById('balance').textContent = Math.floor(gameState.balance);
    document.getElementById('energy-text').textContent = `${Math.floor(gameState.energy)}/${Math.floor(gameState.maxEnergy)}`;
    document.getElementById('energy-fill').style.width = `${(gameState.energy / gameState.maxEnergy) * 100}%`;

    if (gameState.botLevel > 0) {
        document.getElementById('bot-container').classList.remove('hidden');
        document.getElementById('bot-progress').style.width = `${gameState.botProgress}%`;

        const timeLeft = gameState.botCycleTime - (Date.now() - gameState.botStartTime);
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            document.getElementById('bot-time').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            document.getElementById('bot-time').textContent = translations[gameState.language].claim;
        }
    } else {
        document.getElementById('bot-container').classList.add('hidden');
    }

    updateLocalizedTexts();
}

function updateLocalizedTexts() {
    const lang = gameState.language;
    const t = translations[lang];

    document.getElementById('upgrades-title').textContent = t.upgradesTitle;
    document.getElementById('achievements-title').textContent = t.achievementsTitle;
    document.getElementById('referrals-title').textContent = t.referralsTitle;
    document.getElementById('daily-title').textContent = t.dailyTitle;

    document.getElementById('referral-code-text').innerHTML = `${t.yourCode} <span id="referral-code">${gameState.referralCode}</span>`;
    document.getElementById('copy-referral').textContent = t.copy;

    document.getElementById('daily-timer').innerHTML = `${t.nextReward} <span id="daily-time">23:59:59</span>`;
    document.getElementById('daily-amount').innerHTML = `${t.rewardAmount} <span id="daily-reward">0</span>`;
    document.getElementById('claim-daily').textContent = t.claim;

    updateUpgradesList();
    updateAchievementsList();
    updateReferralInfo();
}

function toggleLanguage() {
    gameState.language = gameState.language === 'en' ? 'ru' : 'en';
    updateUI();
    saveGame();
}

function showTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`nav-${tabName}`).classList.add('active');

    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });

    if (tabName !== 'main') {
        document.getElementById(`${tabName}-modal`).classList.add('active');
    }
}

function startGameLoop() {
    setInterval(() => {
        updateEnergy();
        updateBotProgress();
    }, 1000);
}

function updateEnergy() {
    const now = Date.now();
    const timePassed = (now - gameState.lastEnergyUpdate) / 1000;
    gameState.lastEnergyUpdate = now;

    gameState.energy = Math.min(
        gameState.maxEnergy,
        gameState.energy + timePassed * gameState.energyRegenRate
    );

    updateUI();
}

function updateBotProgress() {
    if (gameState.botLevel > 0) {
        if (gameState.botStartTime === 0) {
            gameState.botStartTime = Date.now();
        }

        const timePassed = Date.now() - gameState.botStartTime;
        gameState.botProgress = Math.min(100, (timePassed / gameState.botCycleTime) * 100);

        if (timePassed >= gameState.botCycleTime) {
            const cycles = Math.floor(timePassed / gameState.botCycleTime);
            gameState.botCoins += cycles * calculateBotCoins();
            gameState.botStartTime += cycles * gameState.botCycleTime;
            gameState.botProgress = 0;
        }

        updateUI();
        saveGame();
    }
}

function calculateBotCoins() {
    return 1000 * gameState.botLevel;
}

function collectBotCoins() {
    if (gameState.botCoins > 0) {
        const coins = gameState.botCoins;
        gameState.balance += coins;
        gameState.totalEarned += coins;
        gameState.botCoins = 0;

        showPopup(`+${coins} ${translations[gameState.language].claim}`, 2000);
        updateUI();
        saveGame();
    }
}

function showPopup(text, duration = 2000) {
    const popupContainer = document.getElementById('popup-container');
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = text;

    popupContainer.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, duration);
}

function checkDailyReward() {
    const now = Date.now();
    const lastCollected = gameState.lastDailyCollected;
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastCollected === 0 || now - lastCollected >= oneDay) {
        gameState.dailyCollected = false;
        const dailyAmount = calculateDailyReward();
        document.getElementById('daily-reward').textContent = Math.floor(dailyAmount);
        document.getElementById('claim-daily').disabled = false;
    } else {
        gameState.dailyCollected = true;
        const timeLeft = oneDay - (now - lastCollected);
        updateDailyTimer(timeLeft);
        document.getElementById('claim-daily').disabled = true;
    }
}

function calculateDailyReward() {
    const baseReward = 1000;
    const balanceBonus = Math.min(gameState.balance * 0.01, 15000 - baseReward);
    return baseReward + balanceBonus;
}

function updateDailyTimer(timeLeft) {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('daily-time').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft > 0) {
        setTimeout(() => {
            updateDailyTimer(timeLeft - 1000);
        }, 1000);
    } else {
        checkDailyReward();
    }
}

function claimDailyReward() {
    if (!gameState.dailyCollected) {
        const dailyAmount = calculateDailyReward();
        gameState.balance += dailyAmount;
        gameState.totalEarned += dailyAmount;
        gameState.lastDailyCollected = Date.now();
        gameState.dailyCollected = true;

        showPopup(`${translations[gameState.language].dailyTitle}: +${Math.floor(dailyAmount)}!`, 2000);
        updateUI();
        checkDailyReward();
        saveGame();
    }
}

function copyReferralCode() {
    const code = gameState.referralCode;
    navigator.clipboard.writeText(code).then(() => {
        showPopup(translations[gameState.language].copy, 1000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

window.addEventListener('DOMContentLoaded', initGame);