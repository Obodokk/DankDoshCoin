// Оптимизированный Game State
const gameState = {
    balance: 0,
    clickPower: 1,
    energy: 100,
    maxEnergy: 100,
    totalClicks: 0,
    totalEarned: 0,
    autoEarned: 0,
    spentOnUpgrades: 0,
    playTime: 0,
    level: 1,
    xp: 0,
    combo: 0,
    highestCombo: 0,
    lastClickTime: 0,
    comboTimeout: null,
    totalCriticals: 0,
    highestCritical: 1,
    criticalChance: 0.05,
    criticalMultiplier: 2,
    boostsUsed: 0,
    boostEndTime: 0,
    fastClicks: 0,
    fullEnergyStreak: 0,
    highestMultiplier: 1,
    multipliers: {
        combo: 1,
        boost: 1,
        total: 1
    },
    upgrades: {
        clickPower: 1,
        autoClicker: 0,
        energy: 1,
        comboTime: 1,
        criticalChance: 1,
        criticalPower: 1,
        boost: 0
    },
    achievements: [],
    startTime: Date.now(),
    lastPlayDate: new Date().toDateString(),
    consecutiveDays: 1
};

// DOM Elements
const elements = {
    balance: document.getElementById('balance'),
    coin: document.getElementById('coin'),
    clickEffect: document.getElementById('click-effect'),
    clickPower: document.getElementById('click-power'),
    totalEarned: document.getElementById('total-earned'),
    autoClicker: document.getElementById('auto-clicker'),
    playerLevel: document.getElementById('player-level'),
    levelProgress: document.getElementById('level-progress'),
    levelProgressText: document.getElementById('level-progress-text'),
    energyText: document.getElementById('energy-text'),
    energyFill: document.getElementById('energy-fill'),
    energyValue: document.getElementById('energy-value'),
    currentMultiplier: document.getElementById('current-multiplier'),
    notification: document.getElementById('notification'),
    comboDisplay: document.getElementById('combo-display'),
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),
    upgradeClickBtn: document.getElementById('upgrade-click'),
    upgradeAutoBtn: document.getElementById('upgrade-auto'),
    upgradeEnergyBtn: document.getElementById('upgrade-energy'),
    upgradeComboBtn: document.getElementById('upgrade-combo'),
    upgradeCriticalBtn: document.getElementById('upgrade-critical'),
    upgradeBoostBtn: document.getElementById('upgrade-boost'),
    clickUpgradeCost: document.getElementById('click-upgrade-cost'),
    autoUpgradeCost: document.getElementById('auto-upgrade-cost'),
    energyUpgradeCost: document.getElementById('energy-upgrade-cost'),
    comboUpgradeCost: document.getElementById('combo-upgrade-cost'),
    criticalUpgradeCost: document.getElementById('critical-upgrade-cost'),
    boostUpgradeCost: document.getElementById('boost-upgrade-cost'),
    clickPowerLevel: document.getElementById('click-power-level'),
    clickPowerValue: document.getElementById('click-power-value'),
    autoClickerLevel: document.getElementById('auto-clicker-level'),
    autoClickerValue: document.getElementById('auto-clicker-value'),
    energyLevel: document.getElementById('energy-level'),
    energyMaxValue: document.getElementById('energy-max-value'),
    comboTimeLevel: document.getElementById('combo-time-level'),
    comboTimeValue: document.getElementById('combo-time-value'),
    comboMultiplierValue: document.getElementById('combo-multiplier-value'),
    criticalLevel: document.getElementById('critical-level'),
    criticalChance: document.getElementById('critical-chance'),
    criticalMultiplier: document.getElementById('critical-multiplier'),
    boostLevel: document.getElementById('boost-level'),
    boostValue: document.getElementById('boost-value'),
    boostDuration: document.getElementById('boost-duration'),
    statsTotalClicks: document.getElementById('stats-total-clicks'),
    statsTotalEarned: document.getElementById('stats-total-earned'),
    statsAutoEarned: document.getElementById('stats-auto-earned'),
    statsSpent: document.getElementById('stats-spent'),
    statsPlayTime: document.getElementById('stats-play-time'),
    statsCriticals: document.getElementById('stats-criticals'),
    statsHighestCritical: document.getElementById('stats-highest-critical'),
    statsMaxCombo: document.getElementById('stats-max-combo'),
    statsComboMultiplier: document.getElementById('stats-combo-multiplier'),
    statsBoostsUsed: document.getElementById('stats-boosts-used'),
    statsLevel: document.getElementById('stats-level'),
    statsLevelProgress: document.getElementById('stats-level-progress'),
    achievementsContainer: document.getElementById('achievements-container'),
    boostIndicator: document.getElementById('boost-indicator')
};

// Константы
const UPGRADE_COSTS = {
    clickPower: (level) => Math.floor(100 * Math.pow(1.5, level - 1)),
    autoClicker: (level) => Math.floor(1000 * Math.pow(2, level)),
    energy: (level) => Math.floor(500 * Math.pow(1.8, level - 1)),
    comboTime: (level) => Math.floor(750 * Math.pow(1.6, level - 1)),
    criticalChance: (level) => Math.floor(1200 * Math.pow(1.7, level - 1)),
    criticalPower: (level) => Math.floor(1200 * Math.pow(1.7, level - 1)),
    boost: (level) => Math.floor(2000 * Math.pow(1.8, level))
};

const XP_NEEDED = (level) => Math.floor(1000 * Math.pow(1.2, level - 1));

// Достижения
const ACHIEVEMENTS = [
    { id: 'first_coin', name: 'Первая монета', description: 'Заработайте свою первую монету', condition: (s) => s.totalEarned >= 1, reward: 10, icon: '💰' },
    { id: 'novice', name: 'Новичок', description: 'Заработайте 1000 DDC', condition: (s) => s.totalEarned >= 1000, reward: 100, icon: '👶' },
    { id: 'click_master', name: 'Мастер клика', description: 'Совершите 100 кликов', condition: (s) => s.totalClicks >= 100, reward: 50, icon: '👆' },
    { id: 'auto_farmer', name: 'Автофермер', description: 'Купите первый уровень автокликера', condition: (s) => s.upgrades.autoClicker >= 1, reward: 200, icon: '🤖' },
    { id: 'upgrader', name: 'Улучшатель', description: 'Купите 5 улучшений', condition: (s) => (s.upgrades.clickPower + s.upgrades.autoClicker + s.upgrades.energy) >= 5, reward: 250, icon: '🔧' },
    { id: 'energy_keeper', name: 'Энерджайзер', description: 'Увеличьте максимальную энергию до 200', condition: (s) => s.maxEnergy >= 200, reward: 300, icon: '⚡' },
    { id: 'rich', name: 'Богач', description: 'Накопите 10,000 DDC', condition: (s) => s.balance >= 10000, reward: 1000, icon: '🤑' },
    { id: 'pro_player', name: 'Профессионал', description: 'Достигните 10 уровня', condition: (s) => s.level >= 10, reward: 1500, icon: '🏆' },
    { id: 'time_spender', name: 'Ветеран', description: 'Играйте более 1 часа', condition: (s) => s.playTime >= 3600, reward: 500, icon: '⏳' },
    { id: 'all_max', name: 'Легенда DankDosh', description: 'Максимально улучшите все показатели', condition: (s) => s.upgrades.clickPower >= 20 && s.upgrades.autoClicker >= 10 && s.upgrades.energy >= 10, reward: 5000, icon: '🌟' },
    { id: 'combo_beginner', name: 'Комбо-старт', description: 'Достигните комбо x5', condition: (s) => s.highestCombo >= 5, reward: 100, icon: '🎯' },
    { id: 'combo_master', name: 'Мастер комбо', description: 'Достигните комбо x20', condition: (s) => s.highestCombo >= 20, reward: 500, icon: '🎮' },
    { id: 'critical_hitter', name: 'Критический удар', description: 'Совершите 10 критических кликов', condition: (s) => s.totalCriticals >= 10, reward: 300, icon: '💥' },
    { id: 'power_critical', name: 'Мощный критический', description: 'Совершите критический удар с множителем x5 или выше', condition: (s) => s.highestCritical >= 5, reward: 800, icon: '✨' },
    { id: 'fast_clicker', name: 'Скорострел', description: 'Совершите 10 кликов за 5 секунд', condition: (s) => s.fastClicks >= 10, reward: 400, icon: '⏱️' },
    { id: 'energy_saver', name: 'Экономный', description: 'Имейте полную энергию 10 раз подряд', condition: (s) => s.fullEnergyStreak >= 10, reward: 350, icon: '🔋' },
    { id: 'boost_lover', name: 'Любитель бустов', description: 'Активируйте 10 бустов', condition: (s) => s.boostsUsed >= 10, reward: 600, icon: '🚀' },
    { id: 'multiplier_king', name: 'Король множителей', description: 'Имейте общий множитель x10 или выше', condition: (s) => s.highestMultiplier >= 10, reward: 1000, icon: '👑' },
    { id: 'daily_player', name: 'Ежедневный игрок', description: 'Зайдите в игру 7 дней подряд', condition: (s) => s.consecutiveDays >= 7, reward: 700, icon: '📅' },
    { id: 'ultimate_player', name: 'Абсолютный игрок', description: 'Разблокируйте все остальные достижения', condition: (s) => s.achievements.length >= ACHIEVEMENTS.length - 1, reward: 5000, icon: '🏅' }
];

// Основные функции
function initGame() {
    loadGameState();
    checkConsecutiveDays();
    setupEventListeners();

    // Инициализация изображения монеты
elements.coin.innerHTML = `
    <div class="no-select">
        <img src="https://github.com/Obodokk/DankDoshCoin/blob/main/DankDoshCoin.png?raw=true" 
             alt="DankDoshCoin" 
             class="coin-image">
    </div>
`;

document.addEventListener('selectstart', function(e) {
    if (e.target === elements.coin || e.target.closest('.coin')) {
        e.preventDefault();
    }
});

    // Запуск игровых циклов
    setInterval(gameLoop, 1000);
    setInterval(autoClickerLoop, 1000 * 60 * 60 * 12);

    updateUI();
    renderAchievements();
}

function gameLoop() {
    // Обновление времени игры
    gameState.playTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    // Регенерация энергии
    if (gameState.energy < gameState.maxEnergy) {
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 0.2);
        if (gameState.energy === gameState.maxEnergy) {
            gameState.fullEnergyStreak++;
        } else {
            gameState.fullEnergyStreak = 0;
        }
    }

    // Проверка буста
    if (gameState.upgrades.boost > 0 && Date.now() > gameState.boostEndTime) {
        gameState.upgrades.boost = 0;
        elements.boostIndicator.style.display = 'none';
    }

    updateUI();
    checkAchievements();
    saveGameState();
}

function autoClickerLoop() {
    if (gameState.upgrades.autoClicker > 0) {
        const earned = 500 * gameState.upgrades.autoClicker;
        gameState.balance += earned;
        gameState.totalEarned += earned;
        gameState.autoEarned += earned;
        addXP(earned * 0.5);

        showNotification(`Автокликер заработал ${earned} DDC!`);
        updateUI();
    }
}

// Обработчики событий
function setupEventListeners() {
    elements.coin.addEventListener('click', handleCoinClick);

    elements.upgradeClickBtn.addEventListener('click', () => upgrade('clickPower'));
    elements.upgradeAutoBtn.addEventListener('click', () => upgrade('autoClicker'));
    elements.upgradeEnergyBtn.addEventListener('click', () => upgrade('energy'));
    elements.upgradeComboBtn.addEventListener('click', () => upgrade('comboTime'));
    elements.upgradeCriticalBtn.addEventListener('click', () => upgrade('criticalChance'));
    elements.upgradeBoostBtn.addEventListener('click', activateBoost);

    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
}

function handleCoinClick() {
    if (gameState.energy <= 0) {
        showNotification('Недостаточно энергии!');
        return;
    }

    const now = Date.now();
    const timeDiff = now - gameState.lastClickTime;

    // Комбо система
    const comboTime = 2 - (gameState.upgrades.comboTime - 1) * 0.1;
    if (timeDiff < 1000 * comboTime) {
        gameState.combo++;
        clearTimeout(gameState.comboTimeout);
        gameState.comboTimeout = setTimeout(() => {
            gameState.combo = 0;
            calculateMultipliers();
            updateComboUI();
        }, 1000 * comboTime);
    } else {
        gameState.combo = 1;
    }

    // Проверка быстрых кликов
    if (timeDiff < 500) gameState.fastClicks++;
    else gameState.fastClicks = 0;

    gameState.lastClickTime = now;
    gameState.highestCombo = Math.max(gameState.highestCombo, gameState.combo);

    // Критический удар
    const isCritical = Math.random() < (0.05 * gameState.upgrades.criticalChance);
    let earned = gameState.clickPower;
    let multiplier = 1;

    if (isCritical) {
        const critMult = 2 + (gameState.upgrades.criticalPower - 1) * 0.5;
        multiplier *= critMult;
        animateCritical(critMult);
        gameState.totalCriticals++;
        gameState.highestCritical = Math.max(gameState.highestCritical, critMult);
    }

    calculateMultipliers();
    multiplier *= gameState.multipliers.total;
    earned = Math.floor(earned * multiplier);

    // Обновление состояния
    gameState.balance += earned;
    gameState.totalEarned += earned;
    gameState.totalClicks++;
    gameState.energy -= 1;
    addXP(earned);

    // Анимации
    animateCoin();
    showClickEffect(earned);
    updateUI();
    saveGameState();
}

// Система улучшений
function upgrade(type) {
    const cost = UPGRADE_COSTS[type](gameState.upgrades[type] + (type === 'boost' ? 1 : 0));

    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        gameState.spentOnUpgrades += cost;
        gameState.upgrades[type]++;

        // Применение улучшений
        if (type === 'clickPower') {
            gameState.clickPower = gameState.upgrades.clickPower;
        } else if (type === 'energy') {
            gameState.maxEnergy = 100 + (gameState.upgrades.energy - 1) * 20;
            gameState.energy = gameState.maxEnergy;
        }

        showNotification(`Улучшение "${getUpgradeName(type)}" куплено!`);
        updateUI();
        saveGameState();
        addXP(cost * 0.2);
    }
}

function activateBoost() {
    const cost = UPGRADE_COSTS.boost(gameState.upgrades.boost + 1);

    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        gameState.spentOnUpgrades += cost;
        gameState.upgrades.boost++;
        gameState.boostsUsed++;
        gameState.boostEndTime = Date.now() + 3600000 * gameState.upgrades.boost;

        elements.boostIndicator.style.display = 'block';
        showNotification(`Буст активирован! Доход увеличен на ${gameState.upgrades.boost * 50}% на ${gameState.upgrades.boost} часов`);

        updateUI();
        saveGameState();
    }
}

// Вспомогательные функции
function calculateMultipliers() {
    const comboMult = gameState.combo > 1 ? 1 + gameState.combo * 0.05 : 1;
    const boostMult = (gameState.upgrades.boost > 0 && Date.now() < gameState.boostEndTime) ?
        1 + gameState.upgrades.boost * 0.5 : 1;

    gameState.multipliers = {
        combo: comboMult,
        boost: boostMult,
        total: comboMult * boostMult
    };

    gameState.highestMultiplier = Math.max(gameState.highestMultiplier, gameState.multipliers.total);
}

function addXP(amount) {
    gameState.xp += amount;
    const xpNeeded = XP_NEEDED(gameState.level);

    if (gameState.xp >= xpNeeded) {
        gameState.xp -= xpNeeded;
        gameState.level++;
        showNotification(`Уровень повышен! Теперь вы ${gameState.level} уровня!`);
    }
}

function updateComboUI() {
    if (gameState.combo > 1) {
        elements.comboDisplay.innerHTML = `
            <span class="combo-count">${gameState.combo}</span> комбо
            <span class="combo-multiplier">x${(1 + gameState.combo * 0.05).toFixed(2)}</span>
        `;
        elements.comboDisplay.classList.add('active');
    } else {
        elements.comboDisplay.classList.remove('active');
    }
}

// Анимации
function animateCoin() {
    elements.coin.style.transform = 'scale(0.9)';
    elements.coin.style.transition = 'transform 0.1s ease-out';

    setTimeout(() => {
        elements.coin.style.transform = 'scale(1)';
        elements.coin.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 100);
}

function animateCritical(multiplier) {
    const effect = document.createElement('div');
    effect.className = 'critical-effect';
    effect.textContent = `CRIT! x${multiplier.toFixed(1)}`;
    effect.style.left = `${Math.random() * 50 + 25}%`;
    effect.style.animation = 'critical-float 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    document.body.appendChild(effect);

    setTimeout(() => effect.remove(), 1500);
}

function showClickEffect(amount) {
    elements.clickEffect.textContent = `+${amount}`;
    elements.clickEffect.style.animation = 'none';
    void elements.clickEffect.offsetWidth;
    elements.clickEffect.style.animation = 'float-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
}

// Обновление UI
function updateUI() {
    // Основная вкладка
    elements.balance.textContent = gameState.balance.toLocaleString();
    elements.clickPower.textContent = gameState.clickPower;
    elements.totalEarned.textContent = gameState.totalEarned.toLocaleString();
    elements.autoClicker.textContent = gameState.upgrades.autoClicker;
    elements.playerLevel.textContent = gameState.level;

    // Энергия
    const energyPercent = (gameState.energy / gameState.maxEnergy) * 100;
    elements.energyText.textContent = `${Math.floor(gameState.energy)}/${gameState.maxEnergy}`;
    elements.energyFill.style.width = `${energyPercent}%`;
    elements.energyValue.textContent = `${Math.floor(energyPercent)}%`;



    // Множители
    elements.currentMultiplier.textContent = gameState.multipliers.total.toFixed(2);

    // Обновление кнопок улучшений
    updateUpgradeButtons();

    // Статистика
    updateStats();
}

function updateUpgradeButtons() {
    elements.clickPowerLevel.textContent = gameState.upgrades.clickPower;
    elements.clickPowerValue.textContent = gameState.upgrades.clickPower;
    elements.autoClickerLevel.textContent = gameState.upgrades.autoClicker;
    elements.autoClickerValue.textContent = 500 * gameState.upgrades.autoClicker;
    elements.energyLevel.textContent = gameState.upgrades.energy;
    elements.energyMaxValue.textContent = 100 + (gameState.upgrades.energy - 1) * 20;
    elements.comboTimeLevel.textContent = gameState.upgrades.comboTime;
    elements.comboTimeValue.textContent = (2 - (gameState.upgrades.comboTime - 1) * 0.1).toFixed(1);
    elements.criticalLevel.textContent = gameState.upgrades.criticalChance;
    elements.criticalChance.textContent = (5 * gameState.upgrades.criticalChance).toFixed(1);
    elements.criticalMultiplier.textContent = (2 + (gameState.upgrades.criticalPower - 1) * 0.5).toFixed(1);
    elements.boostLevel.textContent = gameState.upgrades.boost;
    elements.boostValue.textContent = (1 + gameState.upgrades.boost * 0.5).toFixed(1);
    elements.boostDuration.textContent = gameState.upgrades.boost;

    // Стоимость улучшений
    elements.clickUpgradeCost.textContent = UPGRADE_COSTS.clickPower(gameState.upgrades.clickPower).toLocaleString();
    elements.autoUpgradeCost.textContent = UPGRADE_COSTS.autoClicker(gameState.upgrades.autoClicker).toLocaleString();
    elements.energyUpgradeCost.textContent = UPGRADE_COSTS.energy(gameState.upgrades.energy).toLocaleString();
    elements.comboUpgradeCost.textContent = UPGRADE_COSTS.comboTime(gameState.upgrades.comboTime).toLocaleString();
    elements.criticalUpgradeCost.textContent = UPGRADE_COSTS.criticalChance(gameState.upgrades.criticalChance).toLocaleString();
    elements.boostUpgradeCost.textContent = UPGRADE_COSTS.boost(gameState.upgrades.boost + 1).toLocaleString();

    // Состояние кнопок
    elements.upgradeClickBtn.disabled = gameState.balance < UPGRADE_COSTS.clickPower(gameState.upgrades.clickPower);
    elements.upgradeAutoBtn.disabled = gameState.balance < UPGRADE_COSTS.autoClicker(gameState.upgrades.autoClicker);
    elements.upgradeEnergyBtn.disabled = gameState.balance < UPGRADE_COSTS.energy(gameState.upgrades.energy);
    elements.upgradeComboBtn.disabled = gameState.balance < UPGRADE_COSTS.comboTime(gameState.upgrades.comboTime);
    elements.upgradeCriticalBtn.disabled = gameState.balance < UPGRADE_COSTS.criticalChance(gameState.upgrades.criticalChance);
    elements.upgradeBoostBtn.disabled = gameState.balance < UPGRADE_COSTS.boost(gameState.upgrades.boost + 1);
}

function updateStats() {
    elements.statsTotalClicks.textContent = gameState.totalClicks.toLocaleString();
    elements.statsTotalEarned.textContent = gameState.totalEarned.toLocaleString();
    elements.statsAutoEarned.textContent = gameState.autoEarned.toLocaleString();
    elements.statsSpent.textContent = gameState.spentOnUpgrades.toLocaleString();
    elements.statsCriticals.textContent = gameState.totalCriticals;
    elements.statsHighestCritical.textContent = gameState.highestCritical.toFixed(1);
    elements.statsMaxCombo.textContent = gameState.highestCombo;
    elements.statsComboMultiplier.textContent = (1 + gameState.highestCombo * 0.05).toFixed(2);
    elements.statsBoostsUsed.textContent = gameState.boostsUsed;
    elements.statsLevel.textContent = gameState.level;

    // Время игры
    const hours = Math.floor(gameState.playTime / 3600);
    const minutes = Math.floor((gameState.playTime % 3600) / 60);
    const seconds = gameState.playTime % 60;
    elements.statsPlayTime.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Прогресс уровня в статистике
    const statsProgressPercent = (gameState.xp / XP_NEEDED(gameState.level)) * 100;
    elements.statsLevelProgress.style.width = `${statsProgressPercent}%`;
}

// Достижения
function checkAchievements() {
    let newAchievements = false;

    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition(gameState)) {
            gameState.achievements.push(achievement.id);
            gameState.balance += achievement.reward;
            showNotification(`Достижение "${achievement.name}" разблокировано! +${achievement.reward} DDC`);
            newAchievements = true;
        }
    });

    if (newAchievements) {
        renderAchievements();
        updateUI();
    }
}

function renderAchievements() {
    elements.achievementsContainer.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);

        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;

        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                ${isUnlocked ? `<div class="achievement-reward">+${achievement.reward} DDC</div>` : ''}
            </div>
        `;

        elements.achievementsContainer.appendChild(achievementCard);
    });
}

// Система сохранения
function saveGameState() {
    const saveData = {
        ...gameState,
        startTime: undefined,
        comboTimeout: null
    };
    localStorage.setItem('dankDoshCoinSave', JSON.stringify(saveData));
}

function loadGameState() {
    const saveData = JSON.parse(localStorage.getItem('dankDoshCoinSave'));
    if (saveData) {
        for (const key in saveData) {
            if (key !== 'startTime' && key !== 'comboTimeout') {
                gameState[key] = saveData[key];
            }
        }
    }

    // Инициализация вычисляемых значений
    gameState.maxEnergy = 100 + (gameState.upgrades.energy - 1) * 20;
    gameState.energy = Math.min(gameState.energy, gameState.maxEnergy);
    gameState.clickPower = gameState.upgrades.clickPower;

    if (gameState.upgrades.boost > 0 && Date.now() > gameState.boostEndTime) {
        gameState.upgrades.boost = 0;
    }
}

// Вспомогательные функции
function checkConsecutiveDays() {
    const today = new Date().toDateString();
    const lastPlayed = new Date(gameState.lastPlayDate);
    const currentDate = new Date();

    if ((currentDate - lastPlayed) > 86400000 * 2) {
        gameState.consecutiveDays = 1;
    } else if ((currentDate - lastPlayed) <= 86400000 * 2 && (currentDate - lastPlayed) > 86400000) {
        gameState.consecutiveDays++;
    }

    gameState.lastPlayDate = today;
}

function showNotification(message) {
    elements.notification.textContent = message;
    elements.notification.classList.add('show');

    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

function switchTab(tabId) {
    elements.tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
    });

    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

function getUpgradeName(type) {
    const names = {
        clickPower: 'Сила клика',
        autoClicker: 'Автокликер',
        energy: 'Энергия',
        comboTime: 'Время комбо',
        criticalChance: 'Шанс крита',
        criticalPower: 'Сила крита',
        boost: 'Буст доходности'
    };
    return names[type] || type;
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', initGame);
