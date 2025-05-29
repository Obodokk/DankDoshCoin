// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract CryptoFortune is Ownable, ReentrancyGuard, VRFConsumerBase {
    // Структура для хранения информации о раунде
    struct Round {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        uint256 ticketPrice;
        uint256 jackpot;
        uint256 totalTickets;
        address[] participants;
        bool isCompleted;
    }

    // Структура для хранения информации о победителе
    struct Winner {
        address winner;
        uint256 amount;
        uint256 roundId;
        uint256 timestamp;
    }

    // Текущий активный раунд
    Round public currentRound;

    // История раундов
    Round[] public rounds;

    // История победителей
    Winner[] public winners;

    // Маппинг участников к количеству билетов в текущем раунде
    mapping(address => uint256) public userTickets;

    // Параметры Chainlink VRF
    bytes32 internal keyHash;
    uint256 internal fee;

    // ID запроса случайности для текущего раунда
    bytes32 public currentRequestId;

    // Максимальное количество билетов на пользователя
    uint256 public constant MAX_TICKETS_PER_USER = 500;

    // Комиссия платформы (1%)
    uint256 public constant PLATFORM_FEE = 100; // 1%

    // Адрес для комиссий
    address public platformWallet;

    // События
    event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event TicketsPurchased(address indexed user, uint256 amount, uint256 totalTickets);
    event RoundCompleted(uint256 indexed roundId, address indexed winner, uint256 amount);
    event RandomnessRequested(uint256 indexed roundId, bytes32 requestId);

    /**
     * Конструктор контракта
     * @param _vrfCoordinator Адрес координатора VRF
     * @param _linkToken Адрес токена LINK
     * @param _keyHash Хеш ключа VRF
     * @param _fee Плата за запрос VRF
     */
    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        keyHash = _keyHash;
        fee = _fee;
        platformWallet = msg.sender;

        // Начинаем первый раунд
        _startNewRound();
    }

    /**
     * Покупка билетов
     * @param _amount Количество билетов для покупки
     */
    function buyTickets(uint256 _amount) external payable nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            userTickets[msg.sender] + _amount <= MAX_TICKETS_PER_USER,
            "Cannot buy more than MAX_TICKETS_PER_USER"
        );

        uint256 totalCost = currentRound.ticketPrice * _amount;
        require(msg.value >= totalCost, "Insufficient funds");

        // Возвращаем излишек, если есть
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        // Обновляем информацию о раунде
        currentRound.jackpot += (totalCost * (1000 - PLATFORM_FEE)) / 1000;
        currentRound.totalTickets += _amount;

        // Добавляем пользователя в участники, если это его первый билет
        if (userTickets[msg.sender] == 0) {
            currentRound.participants.push(msg.sender);
        }

        // Обновляем количество билетов пользователя
        userTickets[msg.sender] += _amount;

        // Отправляем комиссию платформе
        payable(platformWallet).transfer((totalCost * PLATFORM_FEE) / 1000);

        emit TicketsPurchased(msg.sender, _amount, currentRound.totalTickets);
    }

    /**
     * Завершение раунда и выбор победителя
     */
    function completeRound() external onlyOwner {
        require(block.timestamp >= currentRound.endTime, "Round not ended yet");
        require(!currentRound.isCompleted, "Round already completed");
        require(currentRound.participants.length > 0, "No participants");

        // Запрашиваем случайное число у Chainlink VRF
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        currentRequestId = requestRandomness(keyHash, fee);

        emit RandomnessRequested(currentRound.id, currentRequestId);
    }

    /**
     * Callback функция от Chainlink VRF
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(requestId == currentRequestId, "Invalid request ID");
        require(!currentRound.isCompleted, "Round already completed");

        // Выбираем победителя
        uint256 winnerIndex = randomness % currentRound.participants.length;
        address winner = currentRound.participants[winnerIndex];

        // Выплачиваем джекпот победителю
        uint256 prizeAmount = currentRound.jackpot;
        payable(winner).transfer(prizeAmount);

        // Сохраняем информацию о победителе
        winners.push(Winner({
            winner: winner,
            amount: prizeAmount,
            roundId: currentRound.id,
            timestamp: block.timestamp
        }));

        // Помечаем раунд как завершенный
        currentRound.isCompleted = true;

        emit RoundCompleted(currentRound.id, winner, prizeAmount);

        // Начинаем новый раунд
        _startNewRound();
    }

    /**
     * Начало нового раунда
     */
    function _startNewRound() private {
        uint256 nextRoundId = rounds.length + 1;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + 3 days; // Раунд длится 3 дня

        currentRound = Round({
            id: nextRoundId,
            startTime: startTime,
            endTime: endTime,
            ticketPrice: 10 ether, // 10 USDT (предполагаем, что 1 ETH = 1 USDT для простоты)
            jackpot: 0,
            totalTickets: 0,
            participants: new address[](0),
            isCompleted: false
        });

        rounds.push(currentRound);

        emit RoundStarted(nextRoundId, startTime, endTime);
    }

    /**
     * Получение истории победителей
     * @param _limit Количество последних победителей
     */
    function getWinnersHistory(uint256 _limit) external view returns (Winner[] memory) {
        uint256 resultSize = _limit < winners.length ? _limit : winners.length;
        Winner[] memory result = new Winner[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = winners[winners.length - 1 - i];
        }

        return result;
    }

    /**
     * Получение текущего джекпота
     */
    function getCurrentJackpot() external view returns (uint256) {
        return currentRound.jackpot;
    }

    /**
     * Получение информации о текущем раунде
     */
    function getCurrentRound() external view returns (Round memory) {
        return currentRound;
    }

    /**
     * Получение количества билетов пользователя в текущем раунде
     * @param _user Адрес пользователя
     */
    function getUserTickets(address _user) external view returns (uint256) {
        return userTickets[_user];
    }

    /**
     * Обновление адреса для комиссий
     * @param _newWallet Новый адрес
     */
    function updatePlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        platformWallet = _newWallet;
    }

    /**
     * Извлечение LINK токенов (для владельца)
     * @param _to Адрес для отправки
     * @param _amount Количество токенов
     */
    function withdrawLINK(address _to, uint256 _amount) external onlyOwner {
        require(LINK.transfer(_to, _amount), "LINK transfer failed");
    }
}