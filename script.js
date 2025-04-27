// Game State
const gameState = {
    balance: 0,
    clickPower: 1,
    energy: 100,
    maxEnergy: 100,
    totalClicks: 0,
    totalEarned: 0,
    autoEarned: 0,
    spentOnUpgrades: 0,
    playTime: 0, // in seconds
    level: 1,
    xp: 0,
    combo: 0,
    highestCombo: 0,
    lastClickTime: 0,
    comboTimeout: null,
    totalCriticals: 0,
    highestCritical: 1,
    criticalChance: 0.05, // 5% base chance
    criticalMultiplier: 2,
    boostsUsed: 0,
    boostEndTime: 0,
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
    criticalEffect: document.getElementById('critical-effect'),
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

    // Upgrades
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

    // Stats
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

    // Achievements
    achievementsContainer: document.getElementById('achievements-container')
};

// Upgrade Costs
const UPGRADE_COSTS = {
    clickPower: (level) => Math.floor(100 * Math.pow(1.5, level - 1)),
    autoClicker: (level) => Math.floor(1000 * Math.pow(2, level)),
    energy: (level) => Math.floor(500 * Math.pow(1.8, level - 1)),
    comboTime: (level) => Math.floor(750 * Math.pow(1.6, level - 1)),
    criticalChance: (level) => Math.floor(1200 * Math.pow(1.7, level - 1)),
    criticalPower: (level) => Math.floor(1200 * Math.pow(1.7, level - 1)),
    boost: (level) => Math.floor(2000 * Math.pow(1.8, level))
};

// XP needed for each level (cumulative)
const XP_NEEDED = (level) => Math.floor(1000 * Math.pow(1.2, level - 1));

// Achievements
const ACHIEVEMENTS = [
    {
        id: 'first_coin',
        name: 'Первая монета',
        description: 'Заработайте свою первую монету',
        condition: (state) => state.totalEarned >= 1,
        reward: 10,
        icon: '💰'
    },
    {
        id: 'novice',
        name: 'Новичок',
        description: 'Заработайте 1000 DDC',
        condition: (state) => state.totalEarned >= 1000,
        reward: 100,
        icon: '👶'
    },
    {
        id: 'click_master',
        name: 'Мастер клика',
        description: 'Совершите 100 кликов',
        condition: (state) => state.totalClicks >= 100,
        reward: 50,
        icon: '👆'
    },
    {
        id: 'auto_farmer',
        name: 'Автофермер',
        description: 'Купите первый уровень автокликера',
        condition: (state) => state.upgrades.autoClicker >= 1,
        reward: 200,
        icon: '🤖'
    },
    {
        id: 'upgrader',
        name: 'Улучшатель',
        description: 'Купите 5 улучшений',
        condition: (state) => (state.upgrades.clickPower + state.upgrades.autoClicker + state.upgrades.energy) >= 5,
        reward: 250,
        icon: '🔧'
    },
    {
        id: 'energy_keeper',
        name: 'Энерджайзер',
        description: 'Увеличьте максимальную энергию до 200',
        condition: (state) => state.maxEnergy >= 200,
        reward: 300,
        icon: '⚡'
    },
    {
        id: 'rich',
        name: 'Богач',
        description: 'Накопите 10,000 DDC',
        condition: (state) => state.balance >= 10000,
        reward: 1000,
        icon: '🤑'
    },
    {
        id: 'pro_player',
        name: 'Профессионал',
        description: 'Достигните 10 уровня',
        condition: (state) => state.level >= 10,
        reward: 1500,
        icon: '🏆'
    },
    {
        id: 'time_spender',
        name: 'Ветеран',
        description: 'Играйте более 1 часа',
        condition: (state) => state.playTime >= 3600,
        reward: 500,
        icon: '⏳'
    },
    {
        id: 'all_max',
        name: 'Легенда DankDosh',
        description: 'Максимально улучшите все показатели',
        condition: (state) => state.upgrades.clickPower >= 20 && state.upgrades.autoClicker >= 10 && state.upgrades.energy >= 10,
        reward: 5000,
        icon: '🌟'
    },
    {
        id: 'combo_beginner',
        name: 'Комбо-старт',
        description: 'Достигните комбо x5',
        condition: (state) => state.highestCombo >= 5,
        reward: 100,
        icon: '🎯'
    },
    {
        id: 'combo_master',
        name: 'Мастер комбо',
        description: 'Достигните комбо x20',
        condition: (state) => state.highestCombo >= 20,
        reward: 500,
        icon: '🎮'
    },
    {
        id: 'critical_hitter',
        name: 'Критический удар',
        description: 'Совершите 10 критических кликов',
        condition: (state) => state.totalCriticals >= 10,
        reward: 300,
        icon: '💥'
    },
    {
        id: 'power_critical',
        name: 'Мощный критический',
        description: 'Совершите критический удар с множителем x5 или выше',
        condition: (state) => state.highestCritical >= 5,
        reward: 800,
        icon: '✨'
    },
    {
        id: 'fast_clicker',
        name: 'Скорострел',
        description: 'Совершите 10 кликов за 5 секунд',
        condition: (state) => state.fastClicks >= 1,
        reward: 400,
        icon: '⏱️'
    },
    {
        id: 'energy_saver',
        name: 'Экономный',
        description: 'Имейте полную энергию 10 раз подряд',
        condition: (state) => state.fullEnergyStreak >= 10,
        reward: 350,
        icon: '🔋'
    },
    {
        id: 'boost_lover',
        name: 'Любитель бустов',
        description: 'Активируйте 10 бустов',
        condition: (state) => state.boostsUsed >= 10,
        reward: 600,
        icon: '🚀'
    },
    {
        id: 'multiplier_king',
        name: 'Король множителей',
        description: 'Имейте общий множитель x10 или выше',
        condition: (state) => state.highestMultiplier >= 10,
        reward: 1000,
        icon: '👑'
    },
    {
        id: 'daily_player',
        name: 'Ежедневный игрок',
        description: 'Зайдите в игру 7 дней подряд',
        condition: (state) => state.consecutiveDays >= 7,
        reward: 700,
        icon: '📅'
    },
    {
        id: 'ultimate_player',
        name: 'Абсолютный игрок',
        description: 'Разблокируйте все остальные достижения',
        condition: (state) => state.achievements.length >= Object.keys(ACHIEVEMENTS).length - 1,
        reward: 5000,
        icon: '🏅'
    }
];

// Initialize the game
function initGame() {
    // Load saved data
    loadGameState();

    // Check consecutive days
    checkConsecutiveDays();

    // Setup game loop
    setInterval(gameLoop, 1000);

    // Setup auto clicker
    setInterval(autoClickerLoop, 1000 * 60 * 60 * 12); // Every 12 hours

    // Create combo display
    const comboDisplay = document.createElement('div');
    comboDisplay.id = 'combo-display';
    comboDisplay.className = 'combo-container';
    document.body.appendChild(comboDisplay);

    // Create boost indicator
    const boostIndicator = document.createElement('div');
    boostIndicator.id = 'boost-indicator';
    boostIndicator.className = 'boost-indicator';
    boostIndicator.textContent = 'Буст активен!';
    document.body.appendChild(boostIndicator);

    updateUI();
    setupEventListeners();
    renderAchievements();
}

// Game loop
function gameLoop() {
    // Update play time
    gameState.playTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    // Regenerate energy
    if (gameState.energy < gameState.maxEnergy) {
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 0.2);
    }

    // Check boost expiration
    if (gameState.upgrades.boost > 0 && Date.now() > gameState.boostEndTime) {
        gameState.upgrades.boost = 0;
        document.getElementById('boost-indicator').style.display = 'none';
    }

    updateUI();
    checkAchievements();
    saveGameState();
}

// Auto clicker loop
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

// Update UI based on game state
function updateUI() {
    // Main tab
    elements.balance.textContent = gameState.balance.toLocaleString();
    elements.clickPower.textContent = gameState.clickPower;
    elements.totalEarned.textContent = gameState.totalEarned.toLocaleString();
    elements.autoClicker.textContent = gameState.upgrades.autoClicker;
    elements.playerLevel.textContent = gameState.level;

    // Energy
    const energyPercent = (gameState.energy / gameState.maxEnergy) * 100;
    elements.energyText.textContent = `${Math.floor(gameState.energy)}/${gameState.maxEnergy}`;
    elements.energyFill.style.width = `${energyPercent}%`;
    elements.energyValue.textContent = `${Math.floor(energyPercent)}%`;

    // Change energy color based on level
    if (energyPercent >= 70) {
        elements.energyFill.style.background = 'linear-gradient(to right, var(--energy-full), var(--accent-color))';
    } else if (energyPercent >= 30) {
        elements.energyFill.style.background = 'linear-gradient(to right, var(--energy-low), #f39c12)';
    } else {
        elements.energyFill.style.background = 'linear-gradient(to right, var(--energy-empty), #c0392b)';
    }

    // Level progress
    const xpNeeded = XP_NEEDED(gameState.level);
    const progressPercent = (gameState.xp / xpNeeded) * 100;
    elements.levelProgress.style.width = `${progressPercent}%`;
    elements.levelProgressText.textContent = `${gameState.xp}/${xpNeeded}`;

    // Multiplier display
    elements.currentMultiplier.textContent = gameState.multipliers.total.toFixed(2);

    // Upgrades tab
    elements.clickPowerLevel.textContent = gameState.upgrades.clickPower;
    elements.clickPowerValue.textContent = gameState.upgrades.clickPower;
    elements.autoClickerLevel.textContent = gameState.upgrades.autoClicker;
    elements.autoClickerValue.textContent = 500 * gameState.upgrades.autoClicker;
    elements.energyLevel.textContent = gameState.upgrades.energy;
    elements.energyMaxValue.textContent = 100 + (gameState.upgrades.energy - 1) * 20;
    elements.comboTimeLevel.textContent = gameState.upgrades.comboTime;
    elements.comboTimeValue.textContent = (2 - (gameState.upgrades.comboTime - 1) * 0.1).toFixed(1);
    elements.comboMultiplierValue.textContent = (1 + 20 * 0.05).toFixed(1);
    elements.criticalLevel.textContent = gameState.upgrades.criticalChance;
    elements.criticalChance.textContent = (5 * gameState.upgrades.criticalChance).toFixed(1);
    elements.criticalMultiplier.textContent = (2 + (gameState.upgrades.criticalPower - 1) * 0.5).toFixed(1);
    elements.boostLevel.textContent = gameState.upgrades.boost;
    elements.boostValue.textContent = (1 + gameState.upgrades.boost * 0.5).toFixed(1);
    elements.boostDuration.textContent = gameState.upgrades.boost;

    // Update upgrade costs
    elements.clickUpgradeCost.textContent = UPGRADE_COSTS.clickPower(gameState.upgrades.clickPower).toLocaleString();
    elements.autoUpgradeCost.textContent = UPGRADE_COSTS.autoClicker(gameState.upgrades.autoClicker).toLocaleString();
    elements.energyUpgradeCost.textContent = UPGRADE_COSTS.energy(gameState.upgrades.energy).toLocaleString();
    elements.comboUpgradeCost.textContent = UPGRADE_COSTS.comboTime(gameState.upgrades.comboTime).toLocaleString();
    elements.criticalUpgradeCost.textContent = UPGRADE_COSTS.criticalChance(gameState.upgrades.criticalChance).toLocaleString();
    elements.boostUpgradeCost.textContent = UPGRADE_COSTS.boost(gameState.upgrades.boost).toLocaleString();

    // Update upgrade buttons state
    elements.upgradeClickBtn.disabled = gameState.balance < UPGRADE_COSTS.clickPower(gameState.upgrades.clickPower);
    elements.upgradeAutoBtn.disabled = gameState.balance < UPGRADE_COSTS.autoClicker(gameState.upgrades.autoClicker);
    elements.upgradeEnergyBtn.disabled = gameState.balance < UPGRADE_COSTS.energy(gameState.upgrades.energy);
    elements.upgradeComboBtn.disabled = gameState.balance < UPGRADE_COSTS.comboTime(gameState.upgrades.comboTime);
    elements.upgradeCriticalBtn.disabled = gameState.balance < UPGRADE_COSTS.criticalChance(gameState.upgrades.criticalChance);
    elements.upgradeBoostBtn.disabled = gameState.balance < UPGRADE_COSTS.boost(gameState.upgrades.boost + 1);

    // Stats tab
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

    // Play time
    const hours = Math.floor(gameState.playTime / 3600);
    const minutes = Math.floor((gameState.playTime % 3600) / 60);
    const seconds = gameState.playTime % 60;
    elements.statsPlayTime.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Level progress in stats
    const statsProgressPercent = (gameState.xp / XP_NEEDED(gameState.level)) * 100;
    elements.statsLevelProgress.style.width = `${statsProgressPercent}%`;
}

// Setup event listeners
function setupEventListeners() {
    // Coin click
    elements.coin.addEventListener('click', handleCoinClick);

    // Upgrade buttons
    elements.upgradeClickBtn.addEventListener('click', () => upgrade('clickPower'));
    elements.upgradeAutoBtn.addEventListener('click', () => upgrade('autoClicker'));
    elements.upgradeEnergyBtn.addEventListener('click', () => upgrade('energy'));
    elements.upgradeComboBtn.addEventListener('click', () => upgrade('comboTime'));
    elements.upgradeCriticalBtn.addEventListener('click', () => upgrade('criticalChance'));
    elements.upgradeBoostBtn.addEventListener('click', () => activateBoost());

    // Tab switching
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
}

// Handle coin click
function handleCoinClick() {
    if (gameState.energy <= 0) {
        showNotification('Недостаточно энергии!');
        return;
    }

    const now = Date.now();
    const timeDiff = now - gameState.lastClickTime;

    // Combo system
    if (timeDiff < 1000 * (2 - (gameState.upgrades.comboTime - 1) * 0.1)) {
        gameState.combo++;
        clearTimeout(gameState.comboTimeout);
        gameState.comboTimeout = setTimeout(() => {
            gameState.combo = 0;
            updateMultipliers();
            updateComboUI();
        }, 1000 * (2 - (gameState.upgrades.comboTime - 1) * 0.1));
    } else {
        gameState.combo = 1;
    }

    gameState.lastClickTime = now;
    gameState.highestCombo = Math.max(gameState.highestCombo, gameState.combo);

    // Check for critical hit
    const isCritical = Math.random() < (gameState.criticalChance * gameState.upgrades.criticalChance);
    let earned = gameState.clickPower;
    let multiplier = 1;

    if (isCritical) {
        const criticalMultiplier = gameState.criticalMultiplier + (gameState.upgrades.criticalPower - 1) * 0.5;
        multiplier *= criticalMultiplier;
        showCriticalEffect(criticalMultiplier);
        gameState.totalCriticals++;
        gameState.highestCritical = Math.max(gameState.highestCritical, criticalMultiplier);
    }

    // Apply combo multiplier
    if (gameState.combo > 1) {
        const comboMultiplier = 1 + (gameState.combo * 0.05);
        multiplier *= comboMultiplier;
    }

    // Apply boost if active
    if (gameState.upgrades.boost > 0 && now < gameState.boostEndTime) {
        multiplier *= (1 + gameState.upgrades.boost * 0.5);
    }

    earned = Math.floor(earned * multiplier);

    // Update game state
    gameState.balance += earned;
    gameState.totalEarned += earned;
    gameState.totalClicks++;
    gameState.energy -= 1;

    // Add XP
    addXP(earned);

    // Animation
    animateCoin();
    showClickEffect(earned);

    // Update UI
    updateComboUI();
    updateMultipliers();
    updateUI();
    saveGameState();
}

// Activate boost
function activateBoost() {
    const cost = UPGRADE_COSTS.boost(gameState.upgrades.boost + 1);

    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        gameState.spentOnUpgrades += cost;
        gameState.upgrades.boost++;
        gameState.boostsUsed++;
        gameState.boostEndTime = Date.now() + 3600000 * gameState.upgrades.boost; // 1 hour per level

        document.getElementById('boost-indicator').style.display = 'block';
        showNotification(`Буст активирован! Доход увеличен на ${gameState.upgrades.boost * 50}% на ${gameState.upgrades.boost} часов`);

        updateUI();
        saveGameState();
    }
}

// Add XP and check for level up
function addXP(amount) {
    gameState.xp += amount;
    const xpNeeded = XP_NEEDED(gameState.level);

    if (gameState.xp >= xpNeeded) {
        gameState.xp -= xpNeeded;
        gameState.level++;
        showNotification(`Уровень повышен! Теперь вы ${gameState.level} уровня!`);
    }
}

// Update combo UI
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

// Update multipliers
function updateMultipliers() {
    gameState.multipliers.combo = gameState.combo > 1 ? (1 + gameState.combo * 0.05) : 1;
    gameState.multipliers.boost = (gameState.upgrades.boost > 0 && Date.now() < gameState.boostEndTime) ?
        (1 + gameState.upgrades.boost * 0.5) : 1;
    gameState.multipliers.total = gameState.multipliers.combo * gameState.multipliers.boost;

    gameState.highestMultiplier = Math.max(gameState.highestMultiplier, gameState.multipliers.total);
}

// Show critical effect
function showCriticalEffect(multiplier) {
    const effect = document.createElement('div');
    effect.className = 'critical-effect';
    effect.textContent = `CRIT! x${multiplier}`;
    effect.style.left = `${Math.random() * 50 + 25}%`;
    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 1500);
}

// Animate coin on click
function animateCoin() {
    elements.coin.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.coin.style.transform = 'scale(1)';
    }, 100);
}

// Show click effect
function showClickEffect(amount) {
    elements.clickEffect.textContent = `+${amount}`;
    elements.clickEffect.style.animation = 'none';
    void elements.clickEffect.offsetWidth; // Trigger reflow
    elements.clickEffect.style.animation = 'float-up 1s forwards';
}

// Upgrade system
function upgrade(type) {
    const cost = UPGRADE_COSTS[type](gameState.upgrades[type] + (type === 'boost' ? 1 : 0));

    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        gameState.spentOnUpgrades += cost;
        gameState.upgrades[type]++;

        // Apply upgrade effects
        if (type === 'clickPower') {
            gameState.clickPower = gameState.upgrades.clickPower;
        } else if (type === 'energy') {
            gameState.maxEnergy = 100 + (gameState.upgrades.energy - 1) * 20;
            gameState.energy = gameState.maxEnergy; // Refill energy
        }

        showNotification(`Улучшение "${getUpgradeName(type)}" куплено!`);
        updateUI();
        saveGameState();

        // Add XP for upgrade
        addXP(cost * 0.2);
    }
}

// Get upgrade name by type
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

// Check for unlocked achievements
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

// Render achievements
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

// Check consecutive days
function checkConsecutiveDays() {
    const today = new Date().toDateString();
    const lastPlayed = new Date(gameState.lastPlayDate);
    const currentDate = new Date();

    // Reset if more than 1 day passed
    if ((currentDate - lastPlayed) > 86400000 * 2) {
        gameState.consecutiveDays = 1;
    }
    // Increment if played yesterday
    else if ((currentDate - lastPlayed) <= 86400000 * 2 && (currentDate - lastPlayed) > 86400000) {
        gameState.consecutiveDays++;
    }

    gameState.lastPlayDate = today;
}

// Show notification
function showNotification(message) {
    elements.notification.textContent = message;
    elements.notification.classList.add('show');

    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Switch between tabs
function switchTab(tabId) {
    // Update buttons
    elements.tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
    });

    // Update contents
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

// Save game state to localStorage
function saveGameState() {
    const saveData = {
        ...gameState,
        startTime: undefined, // Don't save start time
        comboTimeout: null // Can't save timeout
    };
    localStorage.setItem('dankDoshCoinSave', JSON.stringify(saveData));
}

// Load game state from localStorage
function loadGameState() {
    const saveData = JSON.parse(localStorage.getItem('dankDoshCoinSave'));
    if (saveData) {
        // Restore all properties except startTime and timeout
        for (const key in saveData) {
            if (key !== 'startTime' && key !== 'comboTimeout') {
                gameState[key] = saveData[key];
            }
        }
    }

    // Set max energy based on upgrades
    gameState.maxEnergy = 100 + (gameState.upgrades.energy - 1) * 20;
    gameState.energy = Math.min(gameState.energy, gameState.maxEnergy);

    // Calculate current click power
    gameState.clickPower = gameState.upgrades.clickPower;

    // Reset boost if expired
    if (gameState.upgrades.boost > 0 && Date.now() > gameState.boostEndTime) {
        gameState.upgrades.boost = 0;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);