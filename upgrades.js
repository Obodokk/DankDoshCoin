function updateUpgradesList() {
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = '';

    const lang = gameState.language;
    const t = translations[lang];

    for (const [key, upgrade] of Object.entries(gameState.upgrades)) {
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item';

        const upgradeInfo = document.createElement('div');
        upgradeInfo.className = 'upgrade-info';

        const upgradeName = document.createElement('div');
        upgradeName.className = 'upgrade-name';
        upgradeName.textContent = t.upgradeNames[key];

        const upgradeLevel = document.createElement('div');
        upgradeLevel.className = 'upgrade-level';
        upgradeLevel.textContent = `${t.level}: ${upgrade.level}`;

        upgradeInfo.appendChild(upgradeName);
        upgradeInfo.appendChild(upgradeLevel);

        const upgradePrice = document.createElement('div');
        upgradePrice.className = 'upgrade-price';
        upgradePrice.textContent = `${Math.floor(calculateUpgradePrice(key))}`;

        const buyBtn = document.createElement('button');
        buyBtn.className = 'buy-btn';
        buyBtn.textContent = t.buy;
        buyBtn.disabled = gameState.balance < calculateUpgradePrice(key);
        buyBtn.addEventListener('click', () => buyUpgrade(key));

        upgradeItem.appendChild(upgradeInfo);
        upgradeItem.appendChild(upgradePrice);
        upgradeItem.appendChild(buyBtn);

        upgradesList.appendChild(upgradeItem);
    }
}

function calculateUpgradePrice(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    return upgrade.price * Math.pow(upgrade.multiplier, upgrade.level);
}

function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    const price = calculateUpgradePrice(upgradeKey);

    if (gameState.balance >= price) {
        gameState.balance -= price;
        upgrade.level++;

        applyUpgrade(upgradeKey);

        updateUI();
        saveGame();

        checkUpgradeAchievements();
    }
}

function applyUpgrade(upgradeKey) {
    switch (upgradeKey) {
        case 'clickPower':
            gameState.clickPower = 1 + gameState.upgrades.clickPower.level;
            break;
        case 'energyCapacity':
            gameState.maxEnergy = 100 + (gameState.upgrades.energyCapacity.level * 20);
            break;
        case 'energyRegen':
            gameState.energyRegenRate = 0.5 + (gameState.upgrades.energyRegen.level * 0.1);
            break;
        case 'multiClick':
            gameState.multiClick = 1 + gameState.upgrades.multiClick.level;
            break;
        case 'comboTime':
            gameState.comboTimeout = 2000 + (gameState.upgrades.comboTime.level * 500);
            break;
        case 'comboMultiplier':
            // Уже учитывается при расчете заработка
            break;
        case 'botLevel':
            gameState.botLevel = gameState.upgrades.botLevel.level;
            if (gameState.botLevel > 0 && gameState.botStartTime === 0) {
                gameState.botStartTime = Date.now();
            }
            break;
    }
}