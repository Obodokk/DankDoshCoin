/**
 * Взаимодействие со смарт-контрактом лотереи
 */

// Адрес и ABI контракта (заглушки, нужно заменить на реальные)
const CONTRACT_ADDRESS = '0x...'; // Заменить на адрес развернутого контракта
const CONTRACT_ABI = [ /* ABI контракта */ ];

// Экземпляр контракта
let lotteryContract = null;

// Инициализация контракта
async function initContract() {
    if (typeof window.ethereum === 'undefined') {
        console.error('Ethereum provider not found');
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        lotteryContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        console.log('Contract initialized');
    } catch (error) {
        console.error('Error initializing contract:', error);
    }
}

// Покупка билетов через контракт
async function buyTickets(amount) {
    if (!lotteryContract) {
        await initContract();
    }

    try {
        // Проверяем, что пользователь подключен к правильной сети
        const network = await window.ethereum.request({ method: 'eth_chainId' });
        if (network !== '0x89') { // Polygon Mainnet
            throw new Error('Please connect to Polygon network');
        }

        // Вызываем метод контракта
        const tx = await lotteryContract.buyTickets(amount, {
            value: ethers.utils.parseEther((amount * TICKET_PRICE).toString())
        });

        // Ждем подтверждения транзакции
        await tx.wait();

        return tx.hash;
    } catch (error) {
        console.error('Error buying tickets:', error);
        throw error;
    }
}

// Получение текущего джекпота
async function getCurrentJackpot() {
    if (!lotteryContract) {
        await initContract();
    }

    try {
        const jackpot = await lotteryContract.getCurrentJackpot();
        return ethers.utils.formatEther(jackpot);
    } catch (error) {
        console.error('Error getting jackpot:', error);
        return '0';
    }
}

// Получение информации о текущем раунде
async function getCurrentRoundInfo() {
    if (!lotteryContract) {
        await initContract();
    }

    try {
        const round = await lotteryContract.getCurrentRound();
        return {
            roundId: round.id.toString(),
            endTime: new Date(round.endTime * 1000),
            ticketPrice: ethers.utils.formatEther(round.ticketPrice),
            jackpot: ethers.utils.formatEther(round.jackpot),
            totalTickets: round.totalTickets.toString()
        };
    } catch (error) {
        console.error('Error getting round info:', error);
        return null;
    }
}

// Получение билетов пользователя в текущем раунде
async function getUserTickets(address) {
    if (!lotteryContract) {
        await initContract();
    }

    try {
        const tickets = await lotteryContract.getUserTickets(address);
        return tickets.toString();
    } catch (error) {
        console.error('Error getting user tickets:', error);
        return '0';
    }
}

// Получение истории победителей
async function getWinnersHistory(limit = 10) {
    if (!lotteryContract) {
        await initContract();
    }

    try {
        const winners = await lotteryContract.getWinnersHistory(limit);
        return winners.map(winner => ({
            address: winner.winner,
            amount: ethers.utils.formatEther(winner.amount),
            roundId: winner.roundId.toString(),
            timestamp: new Date(winner.timestamp * 1000)
        }));
    } catch (error) {
        console.error('Error getting winners history:', error);
        return [];
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initContract);