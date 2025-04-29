// Функции для работы с реферальной системой

// Обновление информации о рефералах
function updateReferralInfo() {
    const lang = gameState.language;
    const t = translations[lang];

    const referralStats = document.getElementById('referral-stats');
    referralStats.innerHTML = `
        <p>${t.referralsCount} ${gameState.referrals.length}</p>
        <p>${t.earnedFromRefs} ${Math.floor(calculateTotalReferralEarnings())}</p>
    `;

    const referralBonuses = document.getElementById('referral-bonuses');
    referralBonuses.innerHTML = `<p>${t.referralBonuses}</p>`;

    const bonuses = [
        { count: 3, reward: 5000 },
        { count: 5, reward: 7500 },
        { count: 10, reward: 15000 },
        { count: 15, reward: 22000 },
        { count: 20, reward: 25000 },
        { count: 50, reward: 100000 },
        { count: 100, reward: 500000 }
    ];

    bonuses.forEach(bonus => {
        const bonusItem = document.createElement('div');
        bonusItem.className = 'bonus-item';

        const bonusText = document.createElement('span');
        bonusText.textContent = `${bonus.count} ${t.referrals}: ${bonus.reward}`;

        if (gameState.referrals.length >= bonus.count && !gameState.referralBonusReceived.includes(bonus.count)) {
            const claimBtn = document.createElement('button');
            claimBtn.className = 'buy-btn';
            claimBtn.textContent = t.claim;
            claimBtn.addEventListener('click', () => claimReferralBonus(bonus.count, bonus.reward));

            bonusItem.appendChild(bonusText);
            bonusItem.appendChild(claimBtn);
        } else {
            if (gameState.referralBonusReceived.includes(bonus.count)) {
                bonusItem.classList.add('bonus-completed');
                bonusText.textContent += ' ✓';
            }
            bonusItem.appendChild(bonusText);
        }

        referralBonuses.appendChild(bonusItem);
    });
}

function claimReferralBonus(count, reward) {
    if (!gameState.referralBonusReceived.includes(count) && gameState.referrals.length >= count) {
        gameState.balance += reward;
        gameState.totalEarned += reward;
        gameState.referralBonusReceived.push(count);

        showPopup(`${translations[gameState.language].referralBonuses}: +${reward} for ${count} friends!`, 3000);

        if (count === 3 && !gameState.achievements.firstReferral.unlocked) {
            unlockAchievement('firstReferral');
        }
        if (count === 5 && !gameState.achievements.fiveReferrals.unlocked) {
            unlockAchievement('fiveReferrals');
        }
        if (count === 10 && !gameState.achievements.tenReferrals.unlocked) {
            unlockAchievement('tenReferrals');
        }

        updateReferralInfo();
        updateUI();
        saveGame();
    }
}

function calculateTotalReferralEarnings() {
    return gameState.referrals.reduce((sum, ref) => sum + ref.earned, 0);
}