// Основные переменные игры
let gameState = {
    coins: 0,
    totalCoinsEarned: 0,
    energy: 100,
    maxEnergy: 100,
    lastEnergyUpdate: Date.now(),
    clickPower: 1,
    energyCost: 1,
    energyRegen: 0.5, // энергии в секунду
    combo: 0,
    maxCombo: 0,
    comboTimeout: null,
    comboMultiplier: 1,
    passiveIncome: 0,
    botLevel: 0,
    botProgress: 0,
    botLastUpdate: Date.now(),
    botCollectAmount: 0,
    dailyCollected: false,
    dailyLastCollected: 0,
    referralCode: generateReferralCode(),
    invitedFriends: 0,
    earnedFromFriends: 0,
    language: 'en',
    upgrades: {
        clickPower: { level: 0, maxLevel: 50, cost: 10, costMultiplier: 1.15 },
        energyCapacity: { level: 0, maxLevel: 20, cost: 25, costMultiplier: 1.2 },
        energyRegen: { level: 0, maxLevel: 15, cost: 30, costMultiplier: 1.25 },
        comboTime: { level: 0, maxLevel: 10, cost: 50, costMultiplier: 1.3 },
        comboMultiplier: { level: 0, maxLevel: 10, cost: 75, costMultiplier: 1.35 },
        passiveIncome: { level: 0, maxLevel: 10, cost: 100, costMultiplier: 1.4 },
        botLevel: { level: 0, maxLevel: 10, cost: 200, costMultiplier: 1.5 }
    },
    achievements: {}
};

// Генерация реферального кода
function generateReferralCode() {
    return 'DANK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Инициализация достижений
function initAchievements() {
    const achievements = {
        // Клики
        clickerNovice: { name: { en: "Novice Clicker", ru: "Новичок в кликах" }, desc: { en: "Click 100 times", ru: "Сделать 100 кликов" }, target: 100, reward: 100, emoji: "🖱️", progress: 0, completed: false },
        clickerApprentice: { name: { en: "Apprentice Clicker", ru: "Ученик кликера" }, desc: { en: "Click 500 times", ru: "Сделать 500 кликов" }, target: 500, reward: 500, emoji: "🖱️", progress: 0, completed: false },
        clickerExpert: { name: { en: "Expert Clicker", ru: "Эксперт по кликам" }, desc: { en: "Click 1,000 times", ru: "Сделать 1,000 кликов" }, target: 1000, reward: 1000, emoji: "🖱️", progress: 0, completed: false },
        clickerMaster: { name: { en: "Master Clicker", ru: "Мастер кликов" }, desc: { en: "Click 5,000 times", ru: "Сделать 5,000 кликов" }, target: 5000, reward: 5000, emoji: "🖱️", progress: 0, completed: false },
        clickerLegend: { name: { en: "Legendary Clicker", ru: "Легендарный кликер" }, desc: { en: "Click 10,000 times", ru: "Сделать 10,000 кликов" }, target: 10000, reward: 10000, emoji: "🖱️", progress: 0, completed: false },

        // Комбо
        comboStarter: { name: { en: "Combo Starter", ru: "Начало комбо" }, desc: { en: "Reach 5x combo", ru: "Достичь комбо x5" }, target: 5, reward: 250, emoji: "🔥", progress: 0, completed: false },
        comboMaster: { name: { en: "Combo Master", ru: "Мастер комбо" }, desc: { en: "Reach 10x combo", ru: "Достичь комбо x10" }, target: 10, reward: 500, emoji: "🔥", progress: 0, completed: false },
        comboGod: { name: { en: "Combo God", ru: "Бог комбо" }, desc: { en: "Reach 20x combo", ru: "Достичь комбо x20" }, target: 20, reward: 1000, emoji: "🔥", progress: 0, completed: false },

        // Монеты
        coinCollector: { name: { en: "Coin Collector", ru: "Коллекционер монет" }, desc: { en: "Earn 1,000 coins", ru: "Заработать 1,000 монет" }, target: 1000, reward: 200, emoji: "💰", progress: 0, completed: false },
        coinHoarder: { name: { en: "Coin Hoarder", ru: "Накопитель монет" }, desc: { en: "Earn 5,000 coins", ru: "Заработать 5,000 монет" }, target: 5000, reward: 500, emoji: "💰", progress: 0, completed: false },
        coinMillionaire: { name: { en: "Coin Millionaire", ru: "Монетный миллионер" }, desc: { en: "Earn 10,000 coins", ru: "Заработать 10,000 монет" }, target: 10000, reward: 1000, emoji: "💰", progress: 0, completed: false },
        coinTycoon: { name: { en: "Coin Tycoon", ru: "Монетный магнат" }, desc: { en: "Earn 50,000 coins", ru: "Заработать 50,000 монет" }, target: 50000, reward: 5000, emoji: "💰", progress: 0, completed: false },
        coinKing: { name: { en: "Coin King", ru: "Король монет" }, desc: { en: "Earn 100,000 coins", ru: "Заработать 100,000 монет" }, target: 100000, reward: 10000, emoji: "💰", progress: 0, completed: false },

        // Улучшения
        upgradeNovice: { name: { en: "Upgrade Novice", ru: "Новичок в улучшениях" }, desc: { en: "Buy 5 upgrades", ru: "Купить 5 улучшений" }, target: 5, reward: 250, emoji: "🔧", progress: 0, completed: false },
        upgradeExpert: { name: { en: "Upgrade Expert", ru: "Эксперт улучшений" }, desc: { en: "Buy 15 upgrades", ru: "Купить 15 улучшений" }, target: 15, reward: 750, emoji: "🔧", progress: 0, completed: false },
        upgradeMaster: { name: { en: "Upgrade Master", ru: "Мастер улучшений" }, desc: { en: "Buy 30 upgrades", ru: "Купить 30 улучшений" }, target: 30, reward: 1500, emoji: "🔧", progress: 0, completed: false },

        // Энергия
        energySaver: { name: { en: "Energy Saver", ru: "Экономитель энергии" }, desc: { en: "Have 150 max energy", ru: "Иметь 150 максимальной энергии" }, target: 150, reward: 300, emoji: "⚡", progress: 0, completed: false },
        energyMaster: { name: { en: "Energy Master", ru: "Мастер энергии" }, desc: { en: "Have 250 max energy", ru: "Иметь 250 максимальной энергии" }, target: 250, reward: 500, emoji: "⚡", progress: 0, completed: false },

        // Рефералы
        firstFriend: { name: { en: "First Friend", ru: "Первый друг" }, desc: { en: "Invite 1 friend", ru: "Пригласить 1 друга" }, target: 1, reward: 100, emoji: "👥", progress: 0, completed: false },
        socialButterfly: { name: { en: "Social Butterfly", ru: "Социальная бабочка" }, desc: { en: "Invite 3 friends", ru: "Пригласить 3 друзей" }, target: 3, reward: 500, emoji: "👥", progress: 0, completed: false },
        popular: { name: { en: "Popular", ru: "Популярный" }, desc: { en: "Invite 5 friends", ru: "Пригласить 5 друзей" }, target: 5, reward: 750, emoji: "👥", progress: 0, completed: false },
        influencer: { name: { en: "Influencer", ru: "Инфлюенсер" }, desc: { en: "Invite 10 friends", ru: "Пригласить 10 друзей" }, target: 10, reward: 1500, emoji: "👥", progress: 0, completed: false },
        viral: { name: { en: "Viral", ru: "Вирусный" }, desc: { en: "Invite 20 friends", ru: "Пригласить 20 друзей" }, target: 20, reward: 2500, emoji: "👥", progress: 0, completed: false },

        // Бот
        botStarter: { name: { en: "Bot Starter", ru: "Начало бота" }, desc: { en: "Reach bot level 1", ru: "Достичь 1 уровня бота" }, target: 1, reward: 500, emoji: "🤖", progress: 0, completed: false },
        botMaster: { name: { en: "Bot Master", ru: "Мастер бота" }, desc: { en: "Reach bot level 5", ru: "Достичь 5 уровня бота" }, target: 5, reward: 2500, emoji: "🤖", progress: 0, completed: false },
        botGod: { name: { en: "Bot God", ru: "Бог ботов" }, desc: { en: "Reach bot level 10", ru: "Достичь 10 уровня бота" }, target: 10, reward: 10000, emoji: "🤖", progress: 0, completed: false },

        // Ежедневные награды
        dailyNovice: { name: { en: "Daily Novice", ru: "Новичок ежедневных наград" }, desc: { en: "Claim 3 daily rewards", ru: "Получить 3 ежедневные награды" }, target: 3, reward: 300, emoji: "🎁", progress: 0, completed: false },
        dailyExpert: { name: { en: "Daily Expert", ru: "Эксперт ежедневных наград" }, desc: { en: "Claim 7 daily rewards", ru: "Получить 7 ежедневных наград" }, target: 7, reward: 700, emoji: "🎁", progress: 0, completed: false },
        dailyMaster: { name: { en: "Daily Master", ru: "Мастер ежедневных наград" }, desc: { en: "Claim 15 daily rewards", ru: "Получить 15 ежедневных наград" }, target: 15, reward: 1500, emoji: "🎁", progress: 0, completed: false },
        dailyLegend: { name: { en: "Daily Legend", ru: "Легенда ежедневных наград" }, desc: { en: "Claim 30 daily rewards", ru: "Получить 30 ежедневных наград" }, target: 30, reward: 3000, emoji: "🎁", progress: 0, completed: false },

        // Разное
        energyEfficient: { name: { en: "Energy Efficient", ru: "Энергоэффективный" }, desc: { en: "Click 100 times without running out of energy", ru: "Кликнуть 100 раз без истощения энергии" }, target: 100, reward: 500, emoji: "♻️", progress: 0, completed: false },
        richAndFamous: { name: { en: "Rich and Famous", ru: "Богатый и знаменитый" }, desc: { en: "Earn 50,000 coins and invite 5 friends", ru: "Заработать 50,000 монет и пригласить 5 друзей" }, target: 1, reward: 5000, emoji: "🌟", progress: 0, completed: false },
        completionist: { name: { en: "Completionist", ru: "Завершитель" }, desc: { en: "Complete all other achievements", ru: "Завершить все остальные достижения" }, target: 1, reward: 0, emoji: "🏅", progress: 0, completed: false }
    };

    gameState.achievements = achievements;
}

// Инициализация реферальных бонусов
function initReferralBonuses() {
    return [
        { invited: 3, reward: 5000, emoji: "🥉", completed: false },
        { invited: 5, reward: 7500, emoji: "🎖️", completed: false },
        { invited: 10, reward: 15000, emoji: "🏅", completed: false },
        { invited: 15, reward: 22000, emoji: "🥈", completed: false },
        { invited: 20, reward: 25000, emoji: "🏆", completed: false },
        { invited: 50, reward: 100000, emoji: "💎", completed: false },
        { invited: 100, reward: 500000, emoji: "👑", completed: false }
    ];
}

// Загрузка игры
function loadGame() {
    const savedGame = localStorage.getItem('dankDoshSave');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);

        // Проверка на устаревшие версии сохранения
        if (parsed.version === '1.0') {
            Object.assign(gameState, parsed);

            // Обновляем энергию с учетом времени
            updateEnergy();

            // Обновляем прогресс бота
            updateBotProgress();

            // Проверяем ежедневную награду
            checkDailyReward();
        } else {
            // Если версия не совпадает, начинаем новую игру
            newGame();
        }
    } else {
        newGame();
    }

    // Инициализируем достижения, если их нет
    if (Object.keys(gameState.achievements).length === 0) {
        initAchievements();
    }

    // Инициализируем реферальные бонусы
    gameState.referralBonuses = initReferralBonuses();

    // Обновляем UI
    updateUI();
    renderUpgrades();
    renderAchievements();
    renderReferralBonuses();

    // Запускаем игровой цикл
    gameLoop();
}

// Новая игра
function newGame() {
    gameState = {
        coins: 0,
        totalCoinsEarned: 0,
        energy: 100,
        maxEnergy: 100,
        lastEnergyUpdate: Date.now(),
        clickPower: 1,
        energyCost: 1,
        energyRegen: 0.5,
        combo: 0,
        maxCombo: 0,
        comboMultiplier: 1,
        passiveIncome: 0,
        botLevel: 0,
        botProgress: 0,
        botLastUpdate: Date.now(),
        botCollectAmount: 0,
        dailyCollected: false,
        dailyLastCollected: 0,
        referralCode: generateReferralCode(),
        invitedFriends: 0,
        earnedFromFriends: 0,
        language: 'en',
        upgrades: {
            clickPower: { level: 0, maxLevel: 50, cost: 10, costMultiplier: 1.15 },
            energyCapacity: { level: 0, maxLevel: 20, cost: 25, costMultiplier: 1.2 },
            energyRegen: { level: 0, maxLevel: 15, cost: 30, costMultiplier: 1.25 },
            comboTime: { level: 0, maxLevel: 10, cost: 50, costMultiplier: 1.3 },
            comboMultiplier: { level: 0, maxLevel: 10, cost: 75, costMultiplier: 1.35 },
            passiveIncome: { level: 0, maxLevel: 10, cost: 100, costMultiplier: 1.4 },
            botLevel: { level: 0, maxLevel: 10, cost: 200, costMultiplier: 1.5 }
        },
        version: '1.0'
    };

    initAchievements();
    saveGame();
}

// Сохранение игры
function saveGame() {
    gameState.lastEnergyUpdate = Date.now();
    gameState.botLastUpdate = Date.now();
    localStorage.setItem('dankDoshSave', JSON.stringify(gameState));
}

// Обновление энергии с учетом времени
function updateEnergy() {
    const now = Date.now();
    const timePassed = (now - gameState.lastEnergyUpdate) / 1000; // в секундах

    if (timePassed > 0) {
        const energyGain = timePassed * gameState.energyRegen;
        gameState.energy = Math.min(gameState.energy + energyGain, gameState.maxEnergy);
        gameState.lastEnergyUpdate = now;
    }
}

// Обновление прогресса бота
function updateBotProgress() {
    if (gameState.botLevel > 0) {
        const now = Date.now();
        const timePassed = (now - gameState.botLastUpdate) / 1000; // в секундах

        // Бот заполняет шкалу за 12 часов (43200 секунд)
        const progressGain = (timePassed / 43200) * 100;
        gameState.botProgress = Math.min(gameState.botProgress + progressGain, 100);

        // Рассчитываем количество монет, которое нафармил бот
        const botEarnings = gameState.botLevel * 100 * (progressGain / 100);
        gameState.botCollectAmount += botEarnings;

        gameState.botLastUpdate = now;
    }
}

// Проверка ежедневной награды
function checkDailyReward() {
    const now = Date.now();
    const lastCollected = gameState.dailyLastCollected;
    const oneDay = 24 * 60 * 60 * 1000; // 1 день в миллисекундах

    if (lastCollected === 0 || now - lastCollected >= oneDay) {
        gameState.dailyCollected = false;
    } else {
        gameState.dailyCollected = true;
    }
}

// Игровой цикл
function gameLoop() {
    updateEnergy();
    updateBotProgress();
    updateUI();

    // Сохраняем игру каждые 10 секунд
    if (Date.now() - gameState.lastEnergyUpdate > 10000) {
        saveGame();
    }

    requestAnimationFrame(gameLoop);
}

// Обновление UI
function updateUI() {
    // Обновляем баланс
    document.getElementById('coins').textContent = Math.floor(gameState.coins).toLocaleString();
    document.getElementById('energy').textContent = Math.floor(gameState.energy);
    document.getElementById('max-energy').textContent = Math.floor(gameState.maxEnergy);

    // Обновляем прогресс бота
    document.getElementById('bot-progress').style.width = `${gameState.botProgress}%`;
    document.getElementById('collect-bot').disabled = gameState.botProgress < 100;

    // Обновляем время до готовности бота
    if (gameState.botProgress >= 100) {
        document.getElementById('bot-time').textContent = gameState.language === 'en' ? 'Ready!' : 'Готово!';
    } else {
        const remaining = 43200 - (43200 * (gameState.botProgress / 100)); // в секундах
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = Math.floor(remaining % 60);

        if (gameState.language === 'en') {
            document.getElementById('bot-time').textContent = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            document.getElementById('bot-time').textContent = `${hours}ч ${minutes}м ${seconds}с`;
        }
    }

    // Обновляем множитель
    document.getElementById('multiplier').textContent = `x${gameState.comboMultiplier.toFixed(1)}`;

    // Обновляем реферальную информацию
    document.getElementById('referral-code').value = gameState.referralCode;
    document.getElementById('invited-count').textContent = gameState.invitedFriends;
    document.getElementById('earned-from-friends').textContent = Math.floor(gameState.earnedFromFriends).toLocaleString();

    // Обновляем ежедневную награду
    updateDailyRewardUI();
}

// Обновление UI ежедневной награды
function updateDailyRewardUI() {
    const dailyTimer = document.getElementById('daily-timer');
    const claimButton = document.getElementById('claim-daily');
    const dailyAmount = document.getElementById('daily-amount');

    if (gameState.dailyCollected) {
        const now = Date.now();
        const lastCollected = gameState.dailyLastCollected;
        const oneDay = 24 * 60 * 60 * 1000;
        const nextAvailable = lastCollected + oneDay;
        const timeLeft = nextAvailable - now;

        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

        if (gameState.language === 'en') {
            dailyTimer.textContent = `Next reward in: ${hours}h ${minutes}m ${seconds}s`;
            claimButton.textContent = 'Claimed Today';
            dailyAmount.textContent = `Next reward: ${calculateDailyReward()}`;
        } else {
            dailyTimer.textContent = `Следующая награда через: ${hours}ч ${minutes}м ${seconds}с`;
            claimButton.textContent = 'Получено сегодня';
            dailyAmount.textContent = `Следующая награда: ${calculateDailyReward()}`;
        }

        claimButton.disabled = true;
    } else {
        if (gameState.language === 'en') {
            dailyTimer.textContent = 'Available now!';
            claimButton.textContent = 'Claim Reward';
            dailyAmount.textContent = `Today's reward: ${calculateDailyReward()}`;
        } else {
            dailyTimer.textContent = 'Доступно сейчас!';
            claimButton.textContent = 'Получить награду';
            dailyAmount.textContent = `Сегодняшняя награда: ${calculateDailyReward()}`;
        }

        claimButton.disabled = false;
    }
}

// Расчет ежедневной награды
function calculateDailyReward() {
    const baseReward = 1000;
    const balanceBonus = Math.min(gameState.coins * 0.01, 14000); // Максимум 14000 + 1000 = 15000
    const totalReward = Math.floor(baseReward + balanceBonus);
    return totalReward.toLocaleString();
}

// Клик по монете
function clickCoin() {
    if (gameState.energy >= gameState.energyCost) {
        // Расходуем энергию
        gameState.energy -= gameState.energyCost;

        // Увеличиваем комбо
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);

        // Обновляем множитель комбо
        updateComboMultiplier();

        // Рассчитываем количество монет
        const coinsEarned = gameState.clickPower * gameState.comboMultiplier;
        gameState.coins += coinsEarned;
        gameState.totalCoinsEarned += coinsEarned;

        // Создаем эффект клика
        createClickEffect(coinsEarned);

        // Обновляем комбо
        updateComboDisplay();

        // Проверяем достижения
        checkAchievements('click', 1);
        checkAchievements('coins', coinsEarned);
        checkAchievements('combo', gameState.combo);

        // Сохраняем игру
        saveGame();
    }
}

// Создание эффекта клика
function createClickEffect(amount) {
    const coin = document.getElementById('click-coin');
    const rect = coin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const effect = document.createElement('div');
    effect.className = 'coin-effect';
    effect.textContent = `+${Math.floor(amount)}`;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    document.body.appendChild(effect);

    // Удаляем эффект после анимации
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Обновление множителя комбо
function updateComboMultiplier() {
    const baseMultiplier = 1;
    const comboBonus = gameState.combo * 0.05 * (1 + gameState.upgrades.comboMultiplier.level * 0.1);
    gameState.comboMultiplier = baseMultiplier + comboBonus;
}

// Обновление отображения комбо
function updateComboDisplay() {
    const comboDisplay = document.getElementById('combo-display');

    if (gameState.combo > 1) {
        if (gameState.language === 'en') {
            comboDisplay.textContent = `Combo x${gameState.combo}!`;
        } else {
            comboDisplay.textContent = `Комбо x${gameState.combo}!`;
        }
        comboDisplay.style.opacity = '1';
    } else {
        comboDisplay.style.opacity = '0';
    }

    // Сбрасываем таймер комбо, если он есть
    if (gameState.comboTimeout) {
        clearTimeout(gameState.comboTimeout);
    }

    // Устанавливаем таймер сброса комбо
    const comboTime = 3000 + (gameState.upgrades.comboTime.level * 500); // Базовое время + бонус от улучшения
    gameState.comboTimeout = setTimeout(() => {
        gameState.combo = 0;
        gameState.comboMultiplier = 1;
        comboDisplay.style.opacity = '0';
        saveGame();
    }, comboTime);
}

// Сбор монет от бота
function collectBotCoins() {
    if (gameState.botProgress >= 100) {
        const coinsEarned = Math.floor(gameState.botCollectAmount);
        gameState.coins += coinsEarned;
        gameState.totalCoinsEarned += coinsEarned;
        gameState.botProgress = 0;
        gameState.botCollectAmount = 0;

        // Показываем уведомление
        alert(gameState.language === 'en'
            ? `Collected ${coinsEarned.toLocaleString()} coins from your bot!`
            : `Собрано ${coinsEarned.toLocaleString()} монет от вашего бота!`);

        // Проверяем достижения
        checkAchievements('coins', coinsEarned);

        // Сохраняем игру
        saveGame();
    }
}

// Получение ежедневной награды
function claimDailyReward() {
    if (!gameState.dailyCollected) {
        const reward = calculateDailyReward();
        gameState.coins += reward;
        gameState.totalCoinsEarned += reward;
        gameState.dailyCollected = true;
        gameState.dailyLastCollected = Date.now();

        // Показываем уведомление
        alert(gameState.language === 'en'
            ? `You claimed your daily reward of ${reward.toLocaleString()} coins!`
            : `Вы получили ежедневную награду в размере ${reward.toLocaleString()} монет!`);

        // Проверяем достижения
        checkAchievements('daily', 1);
        checkAchievements('coins', reward);

        // Сохраняем игру
        saveGame();
    }
}

// Покупка улучшения
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];

    if (upgrade.level < upgrade.maxLevel && gameState.coins >= upgrade.cost) {
        // Покупаем улучшение
        gameState.coins -= upgrade.cost;
        upgrade.level++;

        // Увеличиваем стоимость следующего уровня
        upgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);

        // Применяем эффект улучшения
        applyUpgradeEffect(upgradeId);

        // Проверяем достижения
        checkAchievements('upgrades', 1);

        // Обновляем UI
        renderUpgrades();
        updateUI();

        // Сохраняем игру
        saveGame();
    }
}

// Применение эффекта улучшения
function applyUpgradeEffect(upgradeId) {
    switch (upgradeId) {
        case 'clickPower':
            gameState.clickPower = 1 + gameState.upgrades.clickPower.level * 0.5;
            break;
        case 'energyCapacity':
            gameState.maxEnergy = 100 + gameState.upgrades.energyCapacity.level * 10;
            gameState.energy = Math.min(gameState.energy, gameState.maxEnergy);
            break;
        case 'energyRegen':
            gameState.energyRegen = 0.5 + gameState.upgrades.energyRegen.level * 0.1;
            break;
        case 'comboTime':
            // Эффект применяется в updateComboMultiplier
            break;
        case 'comboMultiplier':
            // Эффект применяется в updateComboMultiplier
            break;
        case 'passiveIncome':
            gameState.passiveIncome = gameState.upgrades.passiveIncome.level * 0.1;
            break;
        case 'botLevel':
            gameState.botLevel = gameState.upgrades.botLevel.level;
            break;
    }
}

// Отрисовка улучшений
function renderUpgrades() {
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = '';

    const upgrades = [
        { id: 'clickPower', emoji: '💪', name: { en: 'Click Power', ru: 'Сила клика' }, desc: { en: 'Increases coins per click', ru: 'Увеличивает монеты за клик' } },
        { id: 'energyCapacity', emoji: '⚡', name: { en: 'Energy Capacity', ru: 'Ёмкость энергии' }, desc: { en: 'Increases max energy', ru: 'Увеличивает максимальную энергию' } },
        { id: 'energyRegen', emoji: '♻️', name: { en: 'Energy Regen', ru: 'Регенерация энергии' }, desc: { en: 'Increases energy regeneration', ru: 'Увеличивает восстановление энергии' } },
        { id: 'comboTime', emoji: '⏱️', name: { en: 'Combo Time', ru: 'Время комбо' }, desc: { en: 'Increases combo duration', ru: 'Увеличивает длительность комбо' } },
        { id: 'comboMultiplier', emoji: '🔥', name: { en: 'Combo Multiplier', ru: 'Множитель комбо' }, desc: { en: 'Increases combo multiplier', ru: 'Увеличивает множитель комбо' } },
        { id: 'passiveIncome', emoji: '💰', name: { en: 'Passive Income', ru: 'Пассивный доход' }, desc: { en: 'Earn coins over time', ru: 'Получайте монеты со временем' } },
        { id: 'botLevel', emoji: '🤖', name: { en: 'Bot Level', ru: 'Уровень бота' }, desc: { en: 'Increases bot farming', ru: 'Увеличивает фарминг бота' } }
    ];

    for (const upgrade of upgrades) {
        const upgradeData = gameState.upgrades[upgrade.id];
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item';

        const upgradeInfo = document.createElement('div');
        upgradeInfo.className = 'upgrade-info';

        const upgradeName = document.createElement('div');
        upgradeName.className = 'upgrade-name';
        upgradeName.textContent = `${upgrade.emoji} ${upgrade.name[gameState.language]}`;

        const upgradeDesc = document.createElement('div');
        upgradeDesc.className = 'upgrade-desc';
        upgradeDesc.textContent = upgrade.desc[gameState.language];

        const upgradeLevel = document.createElement('div');
        upgradeLevel.className = 'upgrade-level';
        if (gameState.language === 'en') {
            upgradeLevel.textContent = `Level ${upgradeData.level}/${upgradeData.maxLevel}`;
        } else {
            upgradeLevel.textContent = `Уровень ${upgradeData.level}/${upgradeData.maxLevel}`;
        }

        const upgradeCost = document.createElement('div');
        upgradeCost.className = 'upgrade-cost';
        upgradeCost.textContent = `${upgradeData.cost.toLocaleString()} coins`;

        upgradeInfo.appendChild(upgradeName);
        upgradeInfo.appendChild(upgradeDesc);
        upgradeInfo.appendChild(upgradeLevel);
        upgradeInfo.appendChild(upgradeCost);

        const upgradeBtn = document.createElement('button');
        upgradeBtn.className = 'upgrade-btn';

        if (upgradeData.level >= upgradeData.maxLevel) {
            if (gameState.language === 'en') {
                upgradeBtn.textContent = 'Maxed';
            } else {
                upgradeBtn.textContent = 'Макс.';
            }
            upgradeBtn.disabled = true;
        } else if (gameState.coins < upgradeData.cost) {
            if (gameState.language === 'en') {
                upgradeBtn.textContent = 'Not enough';
            } else {
                upgradeBtn.textContent = 'Не хватает';
            }
            upgradeBtn.disabled = true;
        } else {
            if (gameState.language === 'en') {
                upgradeBtn.textContent = 'Upgrade';
            } else {
                upgradeBtn.textContent = 'Улучшить';
            }
            upgradeBtn.disabled = false;
        }

        upgradeBtn.addEventListener('click', () => buyUpgrade(upgrade.id));

        upgradeItem.appendChild(upgradeInfo);
        upgradeItem.appendChild(upgradeBtn);
        upgradesList.appendChild(upgradeItem);
    }
}

// Отрисовка достижений
function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';

    for (const [id, achievement] of Object.entries(gameState.achievements)) {
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${achievement.completed ? '' : 'achievement-locked'}`;

        const achievementIcon = document.createElement('div');
        achievementIcon.className = 'achievement-icon';
        achievementIcon.textContent = achievement.emoji;

        const achievementInfo = document.createElement('div');
        achievementInfo.className = 'achievement-info';

        const achievementName = document.createElement('div');
        achievementName.className = 'achievement-name';
        achievementName.textContent = achievement.name[gameState.language];

        const achievementDesc = document.createElement('div');
        achievementDesc.className = 'achievement-desc';
        achievementDesc.textContent = achievement.desc[gameState.language];

        const achievementProgress = document.createElement('div');
        achievementProgress.className = 'achievement-progress';

        const achievementProgressBar = document.createElement('div');
        achievementProgressBar.className = 'achievement-progress-bar';

        if (achievement.completed) {
            achievementProgressBar.style.width = '100%';
        } else {
            const progress = (achievement.progress / achievement.target) * 100;
            achievementProgressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        achievementProgress.appendChild(achievementProgressBar);

        const achievementReward = document.createElement('div');
        achievementReward.className = 'achievement-reward';
        achievementReward.textContent = `+${achievement.reward}`;

        achievementInfo.appendChild(achievementName);
        achievementInfo.appendChild(achievementDesc);

        if (!achievement.completed) {
            achievementInfo.appendChild(achievementProgress);
        }

        achievementItem.appendChild(achievementIcon);
        achievementItem.appendChild(achievementInfo);

        if (achievement.completed) {
            achievementItem.appendChild(achievementReward);
        }

        achievementsList.appendChild(achievementItem);
    }
}

// Отрисовка реферальных бонусов
function renderReferralBonuses() {
    const bonusesList = document.getElementById('referral-bonuses-list');
    bonusesList.innerHTML = '';

    for (const bonus of gameState.referralBonuses) {
        const bonusItem = document.createElement('li');

        if (gameState.language === 'en') {
            bonusItem.innerHTML = `
                <span>${bonus.emoji} Invite ${bonus.invited} friends: +${bonus.reward.toLocaleString()} coins</span>
                <span>${gameState.invitedFriends >= bonus.invited ? '✅' : `${gameState.invitedFriends}/${bonus.invited}`}</span>
            `;
        } else {
            bonusItem.innerHTML = `
                <span>${bonus.emoji} Пригласите ${bonus.invited} друзей: +${bonus.reward.toLocaleString()} монет</span>
                <span>${gameState.invitedFriends >= bonus.invited ? '✅' : `${gameState.invitedFriends}/${bonus.invited}`}</span>
            `;
        }

        if (gameState.invitedFriends >= bonus.invited && !bonus.completed) {
            bonus.completed = true;
            gameState.coins += bonus.reward;
            gameState.totalCoinsEarned += bonus.reward;

            // Показываем уведомление
            alert(gameState.language === 'en'
                ? `You earned ${bonus.reward.toLocaleString()} coins for inviting ${bonus.invited} friends!`
                : `Вы получили ${bonus.reward.toLocaleString()} монет за приглашение ${bonus.invited} друзей!`);

            // Проверяем достижения
            checkAchievements('referral', bonus.invited);
            checkAchievements('coins', bonus.reward);

            // Сохраняем игру
            saveGame();
        }

        bonusesList.appendChild(bonusItem);
    }
}

// Проверка достижений
function checkAchievements(type, amount) {
    let updated = false;

    for (const [id, achievement] of Object.entries(gameState.achievements)) {
        if (!achievement.completed) {
            let shouldUpdate = false;

            switch (type) {
                case 'click':
                    if (id.startsWith('clicker')) {
                        achievement.progress += amount;
                        shouldUpdate = achievement.progress >= achievement.target;
                    }
                    break;
                case 'coins':
                    if (id.startsWith('coin')) {
                        achievement.progress += amount;
                        shouldUpdate = achievement.progress >= achievement.target;
                    }
                    break;
                case 'combo':
                    if (id.startsWith('combo')) {
                        if (achievement.progress < amount) {
                            achievement.progress = amount;
                            shouldUpdate = achievement.progress >= achievement.target;
                        }
                    }
                    break;
                case 'upgrades':
                    if (id.startsWith('upgrade')) {
                        achievement.progress += amount;
                        shouldUpdate = achievement.progress >= achievement.target;
                    }
                    break;
                case 'daily':
                    if (id.startsWith('daily')) {
                        achievement.progress += amount;
                        shouldUpdate = achievement.progress >= achievement.target;
                    }
                    break;
                case 'referral':
                    if (id.startsWith('firstFriend') || id.startsWith('social') || id.startsWith('popular') ||
                        id.startsWith('influencer') || id.startsWith('viral')) {
                        if (achievement.progress < amount) {
                            achievement.progress = amount;
                            shouldUpdate = achievement.progress >= achievement.target;
                        }
                    }
                    break;
            }

            // Проверяем специальные достижения
            if (id === 'energyEfficient' && type === 'click') {
                if (gameState.energy >= gameState.energyCost) {
                    achievement.progress += amount;
                    shouldUpdate = achievement.progress >= achievement.target;
                } else {
                    achievement.progress = 0;
                }
            }

            if (id === 'richAndFamous' && (type === 'coins' || type === 'referral')) {
                const hasCoins = gameState.totalCoinsEarned >= 50000;
                const hasFriends = gameState.invitedFriends >= 5;
                achievement.progress = hasCoins && hasFriends ? 1 : 0;
                shouldUpdate = achievement.progress >= achievement.target;
            }

            if (shouldUpdate) {
                achievement.completed = true;
                gameState.coins += achievement.reward;
                gameState.totalCoinsEarned += achievement.reward;
                updated = true;

                // Показываем уведомление о новом достижении
                alert(gameState.language === 'en'
                    ? `Achievement unlocked: ${achievement.name.en}! +${achievement.reward} coins`
                    : `Достижение разблокировано: ${achievement.name.ru}! +${achievement.reward} монет`);
            }
        }
    }

    // Проверяем достижение "Completionist"
    checkCompletionist();

    if (updated) {
        renderAchievements();
        updateUI();
        saveGame();
    }
}

// Проверка достижения "Completionist"
function checkCompletionist() {
    const completionist = gameState.achievements.completionist;
    if (!completionist.completed) {
        let allCompleted = true;

        for (const [id, achievement] of Object.entries(gameState.achievements)) {
            if (id !== 'completionist' && !achievement.completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            completionist.completed = true;
            const reward = Math.floor(gameState.totalCoinsEarned * 0.25);
            completionist.reward = reward;
            gameState.coins += reward;
            gameState.totalCoinsEarned += reward;

            // Показываем уведомление
            alert(gameState.language === 'en'
                ? `All achievements completed! Bonus reward: ${reward.toLocaleString()} coins (+25% of total earned)`
                : `Все достижения завершены! Бонусная награда: ${reward.toLocaleString()} монет (+25% от общего заработка)`);

            renderAchievements();
            updateUI();
            saveGame();
        }
    }
}

// Копирование реферального кода
function copyReferralCode() {
    const referralCode = document.getElementById('referral-code');
    referralCode.select();
    document.execCommand('copy');

    // Показываем уведомление
    alert(gameState.language === 'en'
        ? 'Referral code copied to clipboard!'
        : 'Реферальный код скопирован в буфер обмена!');
}

// Переключение языка
function switchLanguage(lang) {
    gameState.language = lang;
    updateUI();
    renderUpgrades();
    renderAchievements();
    renderReferralBonuses();
    saveGame();
}

// Переключение вкладок
function switchTab(tabId) {
    // Скрываем все вкладки
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Показываем выбранную вкладку
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active-tab');

    // Обновляем активные кнопки навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
}

// Инициализация событий
function initEvents() {
    // Клик по монете
    document.getElementById('click-coin').addEventListener('click', clickCoin);

    // Сбор монет от бота
    document.getElementById('collect-bot').addEventListener('click', collectBotCoins);

    // Получение ежедневной награды
    document.getElementById('claim-daily').addEventListener('click', claimDailyReward);

    // Копирование реферального кода
    document.getElementById('copy-referral').addEventListener('click', copyReferralCode);

    // Переключение языка
    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-ru').addEventListener('click', () => switchLanguage('ru'));

    // Переключение вкладок
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Запуск игры при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    initEvents();
    loadGame();
});