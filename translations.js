const translations = {
    en: {
        // Menu
        menu_home: "Home",
        menu_lottery: "Lottery",
        menu_winners: "Winners",
        menu_faq: "FAQ",
        menu_contacts: "Contacts",
        menu_about: "About",
        menu_tickets: "My Tickets",

        // Time
        days_short: "d",
        hours_short: "h",
        minutes_short: "m",
        seconds_short: "s",
        next_draw_text: "Next draw in:",
        draw_started: "Draw started!",

        // Wallet
        connect_wallet: "Connect Wallet",
        wallet_connected: "Wallet Connected",
        disconnect_wallet: "Disconnect",
        select_wallet: "Select Wallet",
        install_metamask: "Install MetaMask",
        install_trust: "Install Trust Wallet",
        install_coinbase: "Install Coinbase Wallet",
        wallet_not_connected: "Wallet not connected",
        wallet_connect_error: "Connection error",
        wallet_wrong_network: "Please switch to Polygon",

        // Language
        language_select: "Language",
        language_english: "English",
        language_russian: "Russian",

        // Common
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning",
        learn_more: "Learn more",
        view_all: "View All",
        read_more: "Read more",
        close: "Close",
        confirm: "Confirm",
        cancel: "Cancel",
        continue: "Continue",
        back: "Back",
        view_tx: "View Transaction",

        //выбор кошелька
        select_wallet: "Select Wallet",
        test_mode: "(test mode)",

        // Notifications
        notification_success: "Success",
        notification_error: "Error",
        notification_warning: "Warning",
        notification_info: "Info",

        // Home Page
        hero_title: "Crypto Lottery Revolution",
        hero_subtitle: "Win big with decentralized draws on Polygon",
        hero_button: "Play Now",
        current_jackpot: "Current Jackpot",
        ticket_price: "1 ticket = 10 USDT",
        recent_winners: "Recent Winners",
        view_all_winners: "View All Winners",
        how_it_works: "How It Works",
        step1_title: "Connect Wallet",
        step1_desc: "Use MetaMask or any Web3 wallet",
        step2_title: "Buy Tickets",
        step2_desc: "1 ticket = 10 USDT. More tickets = better chances!",
        step3_title: "Wait for Draw",
        step3_desc: "Weekly draws every Sunday",
        security_title: "Security & Transparency",
        feature1_title: "Decentralized",
        feature1_desc: "Smart contracts on Polygon",
        feature2_title: "Provably Fair",
        feature2_desc: "Chainlink VRF for randomness",
        feature3_title: "Transparent",
        feature3_desc: "All transactions verifiable",
        footer_desc: "Decentralized crypto lottery on Polygon",
        copyright_text: "© 2023 CryptoLotto. All rights reserved.",

        // About Page
        about_title: "About CryptoLotto",
        about_mission: "Our Mission",
        about_mission_text: "CryptoLotto is designed to provide a fair, transparent and decentralized way to participate in lotteries using cryptocurrency...",
        about_technology: "Technology",
        about_technology_text: "Our project is built on the Polygon blockchain, which provides low fees and high transaction speeds, and Chainlink VRF for verifiable randomness.",
        about_security: "Security",
        about_security_text: "Audited smart contracts with no admin controls.",
        about_team: "Team",
        about_team_text: "We are a group of blockchain technology enthusiasts with experience in developing decentralized applications...",
        stat1_title: "Decentralized",
        stat1_desc: "No central authority",
        stat2_title: "No Fees",
        stat2_desc: "0% platform fee",
        stat3_title: "24/7",
        stat3_desc: "Always available",

        // Lottery Page
        lottery_title: "Buy Lottery Tickets",
        lottery_subtitle: "Each ticket increases your winning chance!",
        select_tickets: "Select number of tickets",
        set_button: "Set",
        total_cost: "Total Cost",
        buy_button: "Buy Tickets",
        chance_title: "Your Winning Chance",
        chance_note: "More tickets = higher chance to win",
        your_tickets: "Your Tickets",
        ticket_note: "Tickets auto-registered after purchase",
        how_to_play: "How to Play",
        play_step1: "Connect Wallet",
        play_step1_desc: "Use MetaMask with Polygon network",
        play_step2: "Select Tickets",
        play_step2_desc: "Choose how many to purchase",
        play_step3: "Confirm Transaction",
        play_step3_desc: "Pay network fee and confirm",
        play_step4: "Wait for Draw",
        play_step4_desc: "Automatic weekly draws",
        tickets_purchased: "Tickets purchased successfully!",
        purchase_error: "Ticket purchase failed",

        // Tickets Page
        my_tickets: "My Tickets",
        total_tickets: "Total Tickets",
        win_chance: "Win Chance",
        next_draw: "Next Draw",
        tickets_for_draw: "Tickets for next draw",
        no_tickets: "You have no tickets yet. <a href='lottery.html'>Buy tickets</a> to participate.",
        previous_draws: "Previous Draws",
        draw_date: "Draw Date",
        draw_tickets: "Tickets",
        draw_result: "Result",
        not_won: "Not won",
        won: "Won",

        // Winners Page
        winners_title: "Our Winners",
        winners_subtitle: "See lucky jackpot winners",
        last_winner: "Last Winner",
        winners_history: "Winners History",
        date_header: "Date",
        address_header: "Address",
        amount_header: "Amount",
        tickets_header: "Tickets",
        load_more: "Load More",
        winner_story: "Winner Story",
        story_title: "This changed my life",
        story_text: "I won big and it transformed my family's future forever.",

        // FAQ Page
        faq_title: "Frequently Asked Questions",
        faq_subtitle: "Here you will find answers to the most popular questions about CryptoLotto",
        general_faq: "General",
        technical_faq: "Technical",
        payments_faq: "Payments",
        security_faq: "Security",
        faq1_question: "What is CryptoLotto?",
        faq1_answer: "CryptoLotto is a decentralized cryptocurrency lottery that runs on the Polygon blockchain. Users can buy tickets with USDT and participate in weekly draws for large cash prizes.",
        faq2_question: "How to buy tickets?",
        faq2_answer: "1. Connect your crypto wallet (e.g. MetaMask) to our website. 2. Go to the \"Lottery\" page. 3. Select the number of tickets (1 ticket = 10 USDT). 4. Confirm the transaction in your wallet.",
        faq3_question: "How often do the draws take place?",
        faq3_answer: "Draws are held every 3 days at 20:00 GMT. The timer until the next draw is always displayed on the main page.",
        faq4_question: "How is the winner determined?",
        faq4_answer: "We use Chainlink VRF (Verifiable Random Function) - a technology that provides cryptographically verifiable randomness. This ensures that the results of the draw are completely random and cannot be predicted or changed.",
        faq5_question: "What blockchain is used?",
        faq5_answer: "CryptoLotto runs on the Polygon blockchain (formerly Matic Network). We chose Polygon because of its low transaction fees and fast processing speed.",
        faq6_question: "What wallets are supported?",
        faq6_answer: "We support all Web3 wallets including MetaMask, Trust Wallet, Coinbase Wallet and more. The wallet must be connected to the Polygon network and contain USDT to purchase tickets.",
        faq7_question: "How to check the results of the draw?",
        faq7_answer: "All results are recorded in a smart contract and can be verified in the PolygonScan blockchain explorer. We also publish information about the winners on the \"Winners\" page.",
        faq8_question: "How much does a ticket cost?",
        faq8_answer: "1 ticket costs 10 USDT. You can buy any number of tickets for one draw. The more tickets you buy, the higher your chances of winning. You cannot buy more than 100 tickets at a time.",
        faq9_question: "How quickly do payments arrive?",
        faq9_answer: "Payments are made automatically via a smart contract immediately after the draw. Funds are credited to your wallet within a few minutes. In rare cases, with high network load, it may take up to 1 hour.",
        faq10_question: "Is there a fee for purchasing tickets?",
        faq10_answer: "We do not charge any additional fees for ticket purchases. However, you will need to pay a Polygon network fee (Gas fee), which is usually less than $0.01.",
        faq11_question: "How can I be sure that the lottery is fair?",
        faq11_answer: "CryptoLotto uses smart contract technology, which eliminates the possibility of manipulation. The contract code is open and can be verified by anyone. Chainlink VRF is used to generate random numbers, which guarantees the fairness of the draw.",
        faq12_question: "Where are the funds stored before the draw?",
        faq12_answer: "All funds are stored in a smart contract on the Polygon blockchain. No one, including the project creators, can access these funds until the draw.",
        faq13_question: "Ticket safety?",
        faq13_answer: "Stored on blockchain securely.",
        faq14_question: "Lost wallet?",
        faq14_answer: "Cannot recover without seed phrase.",
        faq_contact_title: "Still have questions?",
        faq_contact_text: "Contact our support team and we will definitely help you!",
        contact_us: "Contact Us",

        // Contacts Page
        contact_title: "Contact Us",
        contact_subtitle: "We're here to help with any questions",
        email_title: "Email",
        email_text: "Send us a message and we'll respond within 24 hours",
        telegram_title: "Telegram",
        telegram_text: "Join our community chat for support",
        twitter_title: "Twitter",
        twitter_text: "Follow us for updates and news",
        form_title: "Contact Form",
        form_name: "Your Name",
        form_email: "Email Address",
        form_subject: "Subject",
        subject_general: "General Question",
        subject_technical: "Technical Issue",
        subject_payment: "Payment Question",
        subject_suggestion: "Suggestion",
        form_message: "Your Message",
        form_submit: "Send Message",
        form_success: "Message sent successfully!",
        form_error: "Error sending message",

        // footer
        footer_title: "CryptoLotto",
        links_title: "Links",
        legal_title: "Legal",
        terms_link: "Terms of Use",
        privacy_link: "Privacy Policy",
        risk_link: "Risk Warning"
    },
    ru: {
        // Меню
        menu_home: "Главная",
        menu_lottery: "Лотерея",
        menu_winners: "Победители",
        menu_faq: "FAQ",
        menu_contacts: "Контакты",
        menu_about: "О проекте",
        menu_tickets: "Мои билеты",

        // время розыгрыша
        days_short: "д",
        hours_short: "ч",
        minutes_short: "м",
        seconds_short: "с",
        next_draw_text: "Следующий розыгрыш через:",
        draw_started: "Розыгрыш начался!",

        // Кошелек
        connect_wallet: "Подключить кошелек",
        wallet_connected: "Кошелек подключен",
        disconnect_wallet: "Отключить",
        select_wallet: "Выберите кошелек",
        install_metamask: "Установить MetaMask",
        install_trust: "Установить Trust Wallet",
        install_coinbase: "Установить Coinbase Wallet",
        wallet_not_connected: "Кошелек не подключен",
        wallet_connect_error: "Ошибка подключения",
        wallet_wrong_network: "Пожалуйста, переключитесь на Polygon",

        // Язык
        language_select: "Язык",
        language_english: "Английский",
        language_russian: "Русский",

        // Общее
        loading: "Загрузка...",
        error: "Ошибка",
        success: "Успешно",
        warning: "Внимание",
        learn_more: "Подробнее",
        view_all: "Смотреть все",
        read_more: "Читать далее",
        close: "Закрыть",
        confirm: "Подтвердить",
        cancel: "Отмена",
        continue: "Продолжить",
        back: "Назад",
        view_tx: "Посмотреть транзакцию",

        // Уведомления
        notification_success: "Успешно",
        notification_error: "Ошибка",
        notification_warning: "Внимание",
        notification_info: "Информация",

        // Главная
        hero_title: "Крипто Лотерея нового поколения",
        hero_subtitle: "Выигрывайте крупные призы на блокчейне Polygon",
        hero_button: "Играть сейчас",
        current_jackpot: "Текущий джекпот",
        ticket_price: "1 билет = 10 USDT",
        recent_winners: "Последние победители",
        view_all_winners: "Все победители",
        how_it_works: "Как это работает",
        step1_title: "Подключите кошелек",
        step1_desc: "Используйте MetaMask или другой Web3 кошелек",
        step2_title: "Купите билеты",
        step2_desc: "1 билет = 10 USDT. Чем больше - тем выше шанс!",
        step3_title: "Дождитесь розыгрыша",
        step3_desc: "Еженедельно по воскресеньям",
        security_title: "Безопасность и прозрачность",
        feature1_title: "Децентрализовано",
        feature1_desc: "Смарт-контракты на Polygon",
        feature2_title: "Честный рандом",
        feature2_desc: "Chainlink VRF для случайности",
        feature3_title: "Прозрачность",
        feature3_desc: "Все транзакции можно проверить",
        footer_desc: "Децентрализованная лотерея на Polygon",
        copyright_text: "© 2023 CryptoLotto. Все права защищены.",

        // О проекте
        about_title: "О CryptoLotto",
        about_mission: "Наша миссия",
        about_mission_text: "CryptoLotto создан, чтобы предоставить честный, прозрачный и децентрализованный способ участия в лотереях с использованием криптовалют...",
        about_technology: "Технологии",
        about_technology_text: "Наш проект построен на блокчейне Polygon, что обеспечивает низкие комиссии и высокую скорость транзакций и Chainlink VRF для проверяемой случайности.",
        about_security: "Безопасность",
        about_security_text: "Аудированные контракты без контроля администратора.",
        about_team: "Команда",
        about_team_text: "Мы - группа энтузиастов блокчейн-технологий с опытом разработки децентрализованных приложений...",
        stat1_title: "Децентрализация",
        stat1_desc: "Нет центрального контроля",
        stat2_title: "Без комиссий",
        stat2_desc: "0% комиссии платформы",
        stat3_title: "24/7",
        stat3_desc: "Доступно всегда",

        // Лотерея
        lottery_title: "Купить билеты",
        lottery_subtitle: "Каждый билет увеличивает шанс на победу!",
        select_tickets: "Выберите количество билетов",
        set_button: "Установить",
        total_cost: "Общая стоимость",
        buy_button: "Купить билеты",
        chance_title: "Ваши шансы на победу",
        chance_note: "Чем больше билетов - тем выше шанс",
        your_tickets: "Ваши билеты",
        ticket_note: "Билеты регистрируются автоматически",
        how_to_play: "Как играть",
        play_step1: "Подключите кошелек",
        play_step1_desc: "Используйте MetaMask с сетью Polygon",
        play_step2: "Выберите билеты",
        play_step2_desc: "Укажите количество для покупки",
        play_step3: "Подтвердите транзакцию",
        play_step3_desc: "Оплатите комиссию сети и подтвердите",
        play_step4: "Дождитесь розыгрыша",
        play_step4_desc: "Автоматические розыгрыши еженедельно",
        tickets_purchased: "Билеты успешно куплены!",
        purchase_error: "Ошибка покупки билетов",

        // Мои билеты
        my_tickets: "Мои билеты",
        total_tickets: "Всего билетов",
        win_chance: "Шанс на победу",
        next_draw: "Следующий розыгрыш",
        tickets_for_draw: "Билеты для следующего розыгрыша",
        no_tickets: "У вас пока нет билетов. <a href='lottery.html'>Купите билеты</a> для участия.",
        previous_draws: "Прошлые розыгрыши",
        draw_date: "Дата розыгрыша",
        draw_tickets: "Билеты",
        draw_result: "Результат",
        not_won: "Не выиграли",
        won: "Выиграли",

        // Победители
        winners_title: "Наши победители",
        winners_subtitle: "Смотрите счастливчиков, выигравших джекпот",
        last_winner: "Последний победитель",
        winners_history: "История победителей",
        date_header: "Дата",
        address_header: "Адрес",
        amount_header: "Сумма",
        tickets_header: "Билеты",
        load_more: "Загрузить еще",
        winner_story: "История победителя",
        story_title: "Это изменило мою жизнь",
        story_text: "Мой выигрыш полностью изменил будущее моей семьи.",

        // FAQ
        faq_title: "Часто задаваемые вопросы",
        faq_subtitle: "Здесь вы найдете ответы на самые популярные вопросы о CryptoLotto",
        faq1_question: "Что такое CryptoLotto?",
        faq1_answer: "CryptoLotto - это децентрализованная криптовалютная лотерея, работающая на блокчейне Polygon. Пользователи могут покупать билеты за USDT и участвовать в еженедельных розыгрышах крупных денежных призов.",
        faq2_question: "Как купить билеты?",
        faq2_answer: "1. Подключите ваш криптовалютный кошелек (например, MetaMask) к нашему сайту. 2. Перейдите на страницу \"Лотерея\" 3. Выберите количество билетов (1 билет = 10 USDT). 4. Подтвердите транзакцию в вашем кошельке.",
        faq3_question: "Как часто проходят розыгрыши?",
        faq3_answer: "Розыгрыши проводятся каждые 3 дня, в 20:00 GMT. Таймер до следующего розыгрыша всегда отображается на главной странице.",
        faq4_question: "Как определяется победитель?",
        faq4_answer: "Мы используем Chainlink VRF (Verifiable Random Function) - технологию, которая обеспечивает криптографически проверяемую случайность. Это гарантирует, что результаты розыгрыша абсолютно случайны и не могут быть предсказаны или изменены.",
        faq5_question: "Какой блокчейн используется?",
        faq5_answer: "CryptoLotto работает на блокчейне Polygon (ранее Matic Network). Мы выбрали Polygon из-за низких комиссий за транзакции и высокой скорости обработки операций.",
        faq6_question: "Какие кошельки поддерживаются?",
        faq6_answer: "Мы поддерживаем все Web3-кошельки, включая MetaMask, Trust Wallet, Coinbase Wallet и другие. Кошелек должен быть подключен к сети Polygon и содержать USDT для покупки билетов.",
        faq7_question: "Как проверить результаты розыгрыша?",
        faq7_answer: "Все результаты записываются в смарт-контракт и могут быть проверены в блокчейн-эксплорере PolygonScan. Мы также публикуем информацию о победителях на странице \"Победители\".",
        faq8_question: "Сколько стоит билет?",
        faq8_answer: "1 билет стоит 10 USDT. Вы можете купить любое количество билетов для одного розыгрыша. Чем больше билетов вы покупаете, тем выше ваши шансы на победу. Вы не можете за раз купить больше 100 билетов",
        faq9_question: "Как быстро приходят выплаты?",
        faq9_answer: "Выплаты производятся автоматически через смарт-контракт сразу после розыгрыша. Средства поступают на ваш кошелек в течение нескольких минут. В редких случаях при высокой загрузке сети это может занять до 1 часа.",
        faq10_question: "Есть ли комиссия за покупку билетов?",
        faq10_answer: "Мы не берем дополнительной комиссии с покупки билетов. Однако вам нужно оплатить комиссию сети Polygon (Gas fee), которая обычно составляет менее $0.01.",
        faq11_question: "Как я могу быть уверен, что лотерея честная?",
        faq11_answer: "CryptoLotto использует технологию смарт-контрактов, что исключает возможность манипуляций. Код контракта открыт и может быть проверен любым желающим. Для генерации случайных чисел используется Chainlink VRF, что гарантирует честность розыгрыша.",
        faq12_question: "Где хранятся средства до розыгрыша?",
        faq12_answer: "Все средства хранятся в смарт-контракте на блокчейне Polygon. Никто, включая создателей проекта, не может получить доступ к этим средствам до момента розыгрыша.",
        faq13_question: "Может ли кто-то повлиять на мои билеты?",
        faq13_answer: "Нет, ваши билеты записываются в блокчейн и не могут быть изменены или удалены. Они привязаны к вашему кошельку, и только вы имеете к ним доступ.",
        faq14_question: "Что произойдет, если я потеряю доступ к кошельку?",
        faq14_answer: "К сожалению, если вы потеряете доступ к своему кошельку (например, забудете seed-фразу), мы не сможем восстановить ваши билеты или выплатить выигрыш. Это особенность децентрализованных систем. Пожалуйста, всегда храните резервную копию вашего seed-фразы в безопасном месте.",
        faq_contact_title: "Не нашли ответ на свой вопрос?",
        faq_contact_text: "Свяжитесь с нашей службой поддержки, и мы обязательно вам поможем!",
        contact_us: "Написать нам",

        // Контакты
        contact_title: "Свяжитесь с нами",
        contact_subtitle: "Мы готовы помочь с любыми вопросами",
        email_title: "Электронная почта",
        email_text: "Напишите нам - ответим в течение 24 часов",
        telegram_title: "Telegram",
        telegram_text: "Присоединяйтесь к нашему чату поддержки",
        twitter_title: "Twitter",
        twitter_text: "Подпишитесь на обновления и новости",
        form_title: "Форма обратной связи",
        form_name: "Ваше имя",
        form_email: "Email адрес",
        form_subject: "Тема",
        subject_general: "Общий вопрос",
        subject_technical: "Техническая проблема",
        subject_payment: "Вопрос о выплатах",
        subject_suggestion: "Предложение",
        form_message: "Ваше сообщение",
        form_submit: "Отправить",
        form_success: "Сообщение успешно отправлено!",
        form_error: "Ошибка отправки сообщения",

        //Выблор кошелька
        select_wallet: "Выберите кошелек",
        test_mode: "(тестовый режим)",

        //Футер
        footer_title: "CryptoLotto",
        links_title: "Ссылки",
        legal_title: "Правовая информация",
        terms_link: "Условия использования",
        privacy_link: "Политика конфиденциальности",
        risk_link: "Предупреждение о рисках"
    }
};

// Apply translations to the page
function applyTranslations(language) {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[language][key]) {
            el.textContent = translations[language][key];
        }
    });

    // Translate menu items with data-i18n-menu attribute
    document.querySelectorAll('[data-i18n-menu]').forEach(el => {
        const key = el.getAttribute('data-i18n-menu');
        if (translations[language][key]) {
            el.textContent = translations[language][key];
        }
    });

    // Translate select options
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.title = translations[language].language_select;
        const options = languageSelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === 'en') {
                option.textContent = translations[language].language_english;
            } else if (option.value === 'ru') {
                option.textContent = translations[language].language_russian;
            }
        });
    }

    // Translate wallet button
    const walletBtn = document.getElementById('connectWalletBtn');
    if (walletBtn) {
        if (walletBtn.classList.contains('connected')) {
            walletBtn.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${translations[language].wallet_connected}</span>
                <span class="wallet-address">${walletBtn.dataset.address || ''}</span>
                <button class="disconnect-btn">${translations[language].disconnect_wallet}</button>
            `;
        } else {
            walletBtn.innerHTML = `
                <i class="fas fa-wallet"></i>
                <span>${translations[language].connect_wallet}</span>
            `;
        }
    }

    // Translate wallet modal if exists
    const walletModal = document.querySelector('.wallet-modal');
    if (walletModal) {
        walletModal.querySelector('h3').textContent = translations[language].select_wallet;
        walletModal.querySelectorAll('.wallet-option span').forEach((span, index) => {
            if (index === 0) span.textContent = translations[language].install_metamask;
            else if (index === 1) span.textContent = translations[language].install_trust;
            else if (index === 2) span.textContent = translations[language].install_coinbase;
        });
    }
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Set saved language or default
        const savedLanguage = localStorage.getItem('language') || 'ru';
        applyTranslations(savedLanguage);
        languageSelect.value = savedLanguage;

        // Add change event listener
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('language', selectedLanguage);
            applyTranslations(selectedLanguage);

            // Update wallet button if exists
            const walletBtn = document.getElementById('connectWalletBtn');
            if (walletBtn && walletBtn.classList.contains('connected')) {
                walletBtn.dataset.language = selectedLanguage;
            }
        });
    }
});

// Helper to get current language
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ru';
}

// Helper to translate a specific key
function translate(key) {
    const language = getCurrentLanguage();
    return translations[language][key] || key;
}