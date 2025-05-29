/**
 * Логика работы с билетами (покупка, отображение)
 * Полная версия с проверками баланса и сети
 */

// Цена одного билета в USDT
const TICKET_PRICE = 10;
// Максимальное количество билетов, которое можно купить
const MAX_TICKETS = 500;
// Адрес USDT контракта на Polygon
const USDT_CONTRACT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
// Минимальный баланс USDT (10 USDT + комиссия)
const MIN_BALANCE = 11;

// Текущее количество выбранных билетов
let selectedTickets = 0;
// ABI для USDT контракта (упрощенный)
const USDT_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация кнопок выбора билетов
    initTicketButtons();

    // Инициализация поля для ввода своего количества
    initCustomAmountInput();

    // Инициализация кнопки покупки билетов
    initBuyButton();

    // Загрузка купленных билетов пользователя
    loadUserTickets();
});

/**
 * Инициализация кнопок выбора билетов
 */
function initTicketButtons() {
    const ticketOptions = document.querySelectorAll('.ticket-option');

    ticketOptions.forEach(option => {
        option.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            selectTickets(amount);

            // Подсветка выбранной опции
            ticketOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

/**
 * Инициализация поля для ввода своего количества билетов
 */
function initCustomAmountInput() {
    const customInput = document.getElementById('customTicketAmount');
    const setButton = document.getElementById('setCustomAmount');

    if (customInput && setButton) {
        setButton.addEventListener('click', function() {
            const amount = parseInt(customInput.value) || 0;
            selectTickets(amount);
        });

        customInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const amount = parseInt(this.value) || 0;
                selectTickets(amount);
            }
        });
    }
}

/**
 * Выбор количества билетов
 * @param {number} amount - Количество билетов
 */
function selectTickets(amount) {
    // Проверяем максимальное количество
    if (amount > MAX_TICKETS) {
        showNotification(`Максимальное количество билетов: ${MAX_TICKETS}`, 'error');
        amount = MAX_TICKETS;
        document.getElementById('customTicketAmount').value = MAX_TICKETS;
    }

    selectedTickets = amount;
    updateTotalCost();
    updateChancePercentage();
}

/**
 * Обновление отображения общей стоимости
 */
function updateTotalCost() {
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        const total = selectedTickets * TICKET_PRICE;
        totalElement.textContent = total + ' USDT';
    }
}

/**
 * Обновление отображения шанса на победу
 */
function updateChancePercentage() {
    // В реальной реализации здесь будет запрос к контракту для получения общего количества билетов
    const totalTickets = 1000; // Заглушка для демонстрации

    const chancePercentage = document.getElementById('chancePercentage');
    const chancePercentText = document.getElementById('chancePercentText');

    if (selectedTickets === 0) {
        if (chancePercentage) chancePercentage.style.width = '0%';
        if (chancePercentText) chancePercentText.textContent = '0%';
        return;
    }

    const chance = (selectedTickets / totalTickets) * 100;
    const displayChance = Math.min(chance, 100); // Не более 100%

    if (chancePercentage) chancePercentage.style.width = `${displayChance}%`;
    if (chancePercentText) chancePercentText.textContent = `${displayChance.toFixed(2)}%`;
}

/**
 * Инициализация кнопки покупки билетов
 */
function initBuyButton() {
    const buyButton = document.getElementById('buyTicketsBtn');

    if (buyButton) {
        buyButton.addEventListener('click', async function() {
            // Проверяем подключение кошелька
            const address = getCurrentAddress();
            if (!address) {
                showNotification('Пожалуйста, подключите кошелек', 'error');
                return;
            }

            // Проверяем количество билетов
            if (selectedTickets <= 0) {
                showNotification('Пожалуйста, выберите количество билетов', 'error');
                return;
            }

            // Проверяем баланс USDT
            try {
                const hasEnoughBalance = await checkUSDTBalance(address, selectedTickets * TICKET_PRICE);
                if (!hasEnoughBalance) {
                    showNotification('Недостаточно USDT на балансе', 'error');
                    return;
                }
            } catch (error) {
                console.error('Ошибка проверки баланса:', error);
                showNotification('Ошибка проверки баланса', 'error');
                return;
            }

            // Проверяем сеть (Polygon)
            try {
                const isCorrectNetwork = await checkAndSwitchNetwork();
                if (!isCorrectNetwork) {
                    showNotification('Пожалуйста, переключитесь на сеть Polygon', 'error');
                    return;
                }
            } catch (error) {
                console.error('Ошибка проверки сети:', error);
                showNotification('Ошибка проверки сети', 'error');
                return;
            }

            // Покупка билетов
            buyTickets(address, selectedTickets);
        });
    }
}

/**
 * Проверка баланса USDT
 * @param {string} address - Адрес кошелька
 * @param {number} requiredAmount - Требуемое количество USDT
 */
async function checkUSDTBalance(address, requiredAmount) {
    if (typeof window.ethereum === 'undefined') return false;

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);

        // Получаем баланс USDT (в wei)
        const balance = await usdtContract.balanceOf(address);
        // USDT имеет 6 знаков после запятой
        const balanceInUSDT = ethers.utils.formatUnits(balance, 6);

        return parseFloat(balanceInUSDT) >= requiredAmount;
    } catch (error) {
        console.error('Ошибка проверки баланса USDT:', error);
        throw error;
    }
}

/**
 * Покупка билетов
 * @param {string} address - Адрес кошелька
 * @param {number} amount - Количество билетов
 */
async function buyTickets(address, amount) {
    try {
        // В реальной реализации здесь будет вызов метода контракта
        console.log(`Покупка ${amount} билетов для адреса ${address}`);

        // Показываем индикатор загрузки
        const buyButton = document.getElementById('buyTicketsBtn');
        if (buyButton) {
            buyButton.disabled = true;
            buyButton.innerHTML = '<span class="loading-spinner"></span> Обработка...';
        }

        // Имитация запроса к блокчейну (в реальности будет вызов контракта)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Успешная покупка
        showNotification(`Успешно куплено ${amount} билетов!`, 'success');

        // Обновляем список билетов пользователя
        addUserTickets(address, amount);

    } catch (error) {
        console.error('Ошибка покупки билетов:', error);
        showNotification(`Ошибка: ${error.message}`, 'error');
    } finally {
        // Восстанавливаем кнопку
        const buyButton = document.getElementById('buyTicketsBtn');
        if (buyButton) {
            buyButton.disabled = false;
            buyButton.textContent = 'Купить билеты';
        }
    }
}

/**
 * Добавление билетов пользователя
 * @param {string} address - Адрес кошелька
 * @param {number} amount - Количество билетов
 */
function addUserTickets(address, amount) {
    // В реальной реализации здесь будет запись в контракт
    // Для демонстрации сохраняем в localStorage
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '{}');
    tickets[address] = (tickets[address] || 0) + amount;
    localStorage.setItem('userTickets', JSON.stringify(tickets));

    // Обновляем отображение
    loadUserTickets();
}

/**
 * Загрузка билетов пользователя
 */
function loadUserTickets() {
    const address = getCurrentAddress();
    if (!address) return;

    const ticketsList = document.getElementById('ticketsList');
    if (!ticketsList) return;

    // В реальной реализации здесь будет запрос к контракту
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '{}');
    const userTickets = tickets[address] || 0;

    if (userTickets > 0) {
        ticketsList.innerHTML = `
            <div class="user-tickets-info">
                <h3>У вас ${userTickets} билетов в этом раунде</h3>
                <p>Ваши шансы на победу: ${((userTickets / 1000) * 100).toFixed(2)}%</p>
                <p>Номер вашего билета: #${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            </div>
        `;
    } else {
        ticketsList.innerHTML = '<p class="no-tickets">У вас пока нет билетов в этом раунде</p>';
    }
}