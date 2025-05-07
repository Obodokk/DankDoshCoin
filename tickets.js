document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading user's tickets
    const ticketsGrid = document.getElementById('ticketsGrid');
    const totalTicketsElement = document.getElementById('totalTickets');
    const currentChanceElement = document.getElementById('currentChance');
    const nextDrawElement = document.getElementById('nextDraw');

    // Check if user has tickets (simulated)
    const hasTickets = Math.random() > 0.5;

    if (hasTickets) {
        const ticketCount = Math.floor(Math.random() * 15) + 1;
        totalTicketsElement.textContent = ticketCount;
        currentChanceElement.textContent = `${Math.min(ticketCount * 0.8, 95).toFixed(1)}%`;

        // Generate ticket numbers
        ticketsGrid.innerHTML = '';
        for (let i = 0; i < ticketCount; i++) {
            const ticketNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket-number';
            ticketElement.textContent = `#${ticketNumber}`;
            ticketsGrid.appendChild(ticketElement);
        }
    } else {
        totalTicketsElement.textContent = '0';
        currentChanceElement.textContent = '0%';
    }

    // Set next draw date
    function getNextSunday() {
        const today = new Date();
        const nextSunday = new Date();
        nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
        nextSunday.setHours(20, 0, 0, 0);
        return nextSunday;
    }

    const nextSunday = getNextSunday();
    nextDrawElement.textContent = nextSunday.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
});