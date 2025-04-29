function initAchievements() {
    if (Object.keys(gameState.achievements).length === 0) {
        gameState.achievements = {
            firstClick: { unlocked: false, progress: 0, required: 1 },
            hundredClicks: { unlocked: false, progress: 0, required: 100 },
            thousandClicks: { unlocked: false, progress: 0, required: 1000 },
            tenThousandClicks: { unlocked: false, progress: 0, required: 10000 },
            firstUpgrade: { unlocked: false, progress: 0, required: 1 },
            fiveUpgrades: { unlocked: false, progress: 0, required: 5 },
            tenUpgrades: { unlocked: false, progress: 0, required: 10 },
            firstReferral: { unlocked: false, progress: 0, required: 1 },
            fiveReferrals: { unlocked: false, progress: 0, required: 5 },
            tenReferrals: { unlocked: false, progress: 0, required: 10 },
            dailyCollector: { unlocked: false, progress: 0, required: 1 },
            weekOfDailies: { unlocked: false, progress: 0, required: 7 },
            monthOfDailies: { unlocked: false, progress: 0, required: 30 },
            energySaver: { unlocked: false, progress: 0, required: 1 },
            clickMaster: { unlocked: false, progress: 0, required: 100 },
            comboKing: { unlocked: false, progress: 0, required: 50 },
            botFarmer: { unlocked: false, progress: 0, required: 1 },
            rich: { unlocked: false, progress: 0, required: 10000 },
            millionaire: { unlocked: false, progress: 0, required: 1000000 },
            referralMaster: { unlocked: false, progress: 0, required: 10000 },
            upgradeMaster: { unlocked: false, progress: 0, required: 10 },
            achievementHunter: { unlocked: false, progress: 0, required: 10 },
            allAchievements: { unlocked: false, progress: 0, required: Object.keys(gameState.achievements).length - 1 }
        };
    }
}

function checkClickAchievements() {
    for (const [key, achievement] of Object.entries(gameState.achievements)) {
        if (key.includes('Click') && !achievement.unlocked) {
            achievement.progress++;
            if (achievement.progress >= achievement.required) {
                unlockAchievement(key);
            }
        }
    }

    if (gameState.combo >= 50 && !gameState.achievements.comboKing.unlocked) {
        unlockAchievement('comboKing');
    }

    if (gameState.maxCombo >= 100 && !gameState.achievements.clickMaster.unlocked) {
        unlockAchievement('clickMaster');
    }
}

function checkUpgradeAchievements() {
    const totalUpgradeLevels = Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.level, 0);

    if (totalUpgradeLevels >= 1 && !gameState.achievements.firstUpgrade.unlocked) {
        unlockAchievement('firstUpgrade');
    }

    if (totalUpgradeLevels >= 5 && !gameState.achievements.fiveUpgrades.unlocked) {
        unlockAchievement('fiveUpgrades');
    }

    if (totalUpgradeLevels >= 10 && !gameState.achievements.tenUpgrades.unlocked) {
        unlockAchievement('tenUpgrades');
    }

    if (Object.values(gameState.upgrades).some(u => u.level >= 10) && !gameState.achievements.upgradeMaster.unlocked) {
        unlockAchievement('upgradeMaster');
    }
}

function unlockAchievement(key) {
    const achievement = gameState.achievements[key];
    if (!achievement.unlocked) {
        achievement.unlocked = true;

        const reward = calculateAchievementReward(key);
        gameState.balance += reward;
        gameState.totalEarned += reward;

        showPopup(`${translations[gameState.language].achievementNames[key]}! +${reward}`, 3000);

        checkAllAchievementsUnlocked();

        updateAchievementsList();
        updateUI();
        saveGame();
    }
}

function calculateAchievementReward(key) {
    if (key.includes('Click')) {
        return 100 * gameState.achievements[key].required;
    } else if (key.includes('Upgrade')) {
        return 500 * gameState.upgrades.clickPower.level;
    } else {
        return 1000;
    }
}

function checkAllAchievementsUnlocked() {
    const allUnlocked = Object.values(gameState.achievements).every(a => a.unlocked || a.required === 0);
    if (allUnlocked) {
        const bonus = gameState.totalEarned * 0.25;
        gameState.balance += bonus;
        gameState.totalEarned += bonus;

        showPopup(`${translations[gameState.language].allAchievements}! Bonus: +${Math.floor(bonus)}`, 5000);
        updateUI();
        saveGame();
    }
}

function updateAchievementsList() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';

    const lang = gameState.language;
    const t = translations[lang];

    for (const [key, achievement] of Object.entries(gameState.achievements)) {
        if (key === 'allAchievements') continue;

        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`;

        const achievementIcon = document.createElement('div');
        achievementIcon.className = 'achievement-icon';
        achievementIcon.textContent = getAchievementIcon(key);

        const achievementName = document.createElement('div');
        achievementName.className = 'achievement-name';
        achievementName.textContent = t.achievementNames[key];

        const achievementDesc = document.createElement('div');
        achievementDesc.className = 'achievement-desc';
        achievementDesc.textContent = t.achievementDescriptions[key];

        const achievementReward = document.createElement('div');
        achievementReward.className = 'achievement-reward';
        achievementReward.textContent = `${translations[gameState.language].rewardAmount} ${calculateAchievementReward(key)}`;

        const achievementProgress = document.createElement('div');
        achievementProgress.className = 'achievement-progress';
        achievementProgress.textContent = `${achievement.progress}/${achievement.required}`;

        achievementItem.appendChild(achievementIcon);
        achievementItem.appendChild(achievementName);
        achievementItem.appendChild(achievementDesc);
        achievementItem.appendChild(achievementReward);
        if (!achievement.unlocked) {
            achievementItem.appendChild(achievementProgress);
        }

        achievementsList.appendChild(achievementItem);
    }
}

function getAchievementIcon(key) {
    const icons = {
        firstClick: '👆',
        hundredClicks: '👍',
        thousandClicks: '💪',
        tenThousandClicks: '🤯',
        firstUpgrade: '⚡',
        fiveUpgrades: '🔋',
        tenUpgrades: '🚀',
        firstReferral: '👥',
        fiveReferrals: '👨‍👩‍👧‍👦',
        tenReferrals: '🌍',
        dailyCollector: '🎁',
        weekOfDailies: '📅',
        monthOfDailies: '🗓️',
        energySaver: '🔋',
        clickMaster: '👑',
        comboKing: '🤴',
        botFarmer: '🤖',
        rich: '💰',
        millionaire: '🤑',
        referralMaster: '💸',
        upgradeMaster: '🧙‍♂️',
        achievementHunter: '🏆',
        allAchievements: '🌟'
    };
    return icons[key] || '🏅';
}