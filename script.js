const numbers = [
    { number: 0, color: "green" },
    { number: 32, color: "red" },
    { number: 15, color: "black" },
    { number: 19, color: "red" },
    { number: 4, color: "black" },
    { number: 21, color: "red" },
    { number: 2, color: "black" },
    { number: 25, color: "red" },
    { number: 17, color: "black" },
    { number: 34, color: "red" },
    { number: 6, color: "black" },
    { number: 27, color: "red" },
    { number: 13, color: "black" },
    { number: 36, color: "red" },
    { number: 11, color: "black" },
    { number: 30, color: "red" },
    { number: 8, color: "black" },
    { number: 23, color: "red" },
    { number: 10, color: "black" },
    { number: 5, color: "red" },
    { number: 24, color: "black" },
    { number: 16, color: "red" },
    { number: 33, color: "black" },
    { number: 1, color: "red" },
    { number: 20, color: "black" },
    { number: 14, color: "red" },
    { number: 31, color: "black" },
    { number: 9, color: "red" },
    { number: 22, color: "black" },
    { number: 18, color: "red" },
    { number: 29, color: "black" },
    { number: 7, color: "red" },
    { number: 28, color: "black" },
    { number: 12, color: "red" },
    { number: 35, color: "black" },
    { number: 3, color: "red" },
    { number: 26, color: "black" }
];

// Game state
let balance = 1000;
let wins = 0;
let losses = 0;
let isSpinning = false;

// DOM elements
const wheel = document.getElementById("wheel");
const numberContainer = document.getElementById("number-container");
const spinButton = document.getElementById("spinButton");
const resultText = document.getElementById("result");
const historyContainer = document.getElementById("history");
const balanceElement = document.getElementById("balance");
const winsElement = document.getElementById("wins");
const lossesElement = document.getElementById("losses");
const winRateElement = document.getElementById("winRate");
const betAmountInput = document.getElementById("betAmount");
const quickBetButtons = document.querySelectorAll(".quick-bet");

// Payout multipliers
const PAYOUTS = {
    number: 35, // 35:1 for number bets
    color: 1,   // 1:1 for color bets
    green: 35   // 35:1 for green (0)
};

// Special Events
const SPECIAL_EVENTS = {
    hotNumber: {
        chance: 0.1, // 10% chance
        duration: 5, // 5 spins
        multiplier: 2
    },
    luckyStreak: {
        chance: 0.15, // 15% chance
        duration: 3, // 3 spins
        multiplier: 1.5
    },
    colorBonus: {
        chance: 0.2, // 20% chance
        duration: 4, // 4 spins
        multiplier: 2
    }
};

// Active events
let activeEvents = {
    hotNumber: null,
    luckyStreak: false,
    colorBonus: null
};

// Event counters
let eventCounters = {
    hotNumber: 0,
    luckyStreak: 0,
    colorBonus: 0
};

function drawNumbers() {
    const sections = numbers.length;
    const sectionAngle = 360 / sections;
    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    numbers.forEach((numObj, i) => {
        const number = document.createElement("div");
        number.classList.add("number");
        
        const angle = (i * sectionAngle) + (sectionAngle / 2);
        const radians = (angle - 90) * Math.PI / 180;
        
        const posX = centerX + radius * Math.cos(radians);
        const posY = centerY + radius * Math.sin(radians);

        number.style.left = `${posX - 15}px`;
        number.style.top = `${posY - 15}px`;
        number.textContent = numObj.number;
        number.style.transform = `rotate(${angle}deg)`;

        numberContainer.appendChild(number);
    });
}

function updateStats() {
    balanceElement.textContent = balance;
    winsElement.textContent = wins;
    lossesElement.textContent = losses;
    
    const totalGames = wins + losses;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    winRateElement.textContent = `${winRate}%`;
    
    // Save stats to localStorage
    localStorage.setItem('rouletteBalance', balance);
    localStorage.setItem('rouletteWins', wins);
    localStorage.setItem('rouletteLosses', losses);
}

function loadStats() {
    const savedBalance = localStorage.getItem('rouletteBalance');
    const savedWins = localStorage.getItem('rouletteWins');
    const savedLosses = localStorage.getItem('rouletteLosses');
    
    if (savedBalance) balance = parseInt(savedBalance);
    if (savedWins) wins = parseInt(savedWins);
    if (savedLosses) losses = parseInt(savedLosses);
    
    updateStats();
}

function checkForSpecialEvents() {
    // Hot Number Event
    if (!activeEvents.hotNumber && Math.random() < SPECIAL_EVENTS.hotNumber.chance) {
        const hotNumber = Math.floor(Math.random() * 37);
        activeEvents.hotNumber = hotNumber;
        eventCounters.hotNumber = SPECIAL_EVENTS.hotNumber.duration;
        showNotification(`🔥 Hot Number ${hotNumber} activated! ${SPECIAL_EVENTS.hotNumber.duration} spins with ${SPECIAL_EVENTS.hotNumber.multiplier}x multiplier!`);
    }
    
    // Lucky Streak Event
    if (!activeEvents.luckyStreak && Math.random() < SPECIAL_EVENTS.luckyStreak.chance) {
        activeEvents.luckyStreak = true;
        eventCounters.luckyStreak = SPECIAL_EVENTS.luckyStreak.duration;
        showNotification(`🍀 Lucky Streak activated! ${SPECIAL_EVENTS.luckyStreak.duration} spins with ${SPECIAL_EVENTS.luckyStreak.multiplier}x multiplier!`);
    }
    
    // Color Bonus Event
    if (!activeEvents.colorBonus && Math.random() < SPECIAL_EVENTS.colorBonus.chance) {
        const colors = ['red', 'black'];
        const bonusColor = colors[Math.floor(Math.random() * colors.length)];
        activeEvents.colorBonus = bonusColor;
        eventCounters.colorBonus = SPECIAL_EVENTS.colorBonus.duration;
        showNotification(`🎨 ${bonusColor.charAt(0).toUpperCase() + bonusColor.slice(1)} Color Bonus activated! ${SPECIAL_EVENTS.colorBonus.duration} spins with ${SPECIAL_EVENTS.colorBonus.multiplier}x multiplier!`);
    }
}

function updateSpecialEvents() {
    // Update Hot Number
    if (activeEvents.hotNumber !== null) {
        eventCounters.hotNumber--;
        if (eventCounters.hotNumber <= 0) {
            activeEvents.hotNumber = null;
            showNotification("Hot Number bonus ended!");
        }
    }
    
    // Update Lucky Streak
    if (activeEvents.luckyStreak) {
        eventCounters.luckyStreak--;
        if (eventCounters.luckyStreak <= 0) {
            activeEvents.luckyStreak = false;
            showNotification("Lucky Streak ended!");
        }
    }
    
    // Update Color Bonus
    if (activeEvents.colorBonus !== null) {
        eventCounters.colorBonus--;
        if (eventCounters.colorBonus <= 0) {
            activeEvents.colorBonus = null;
            showNotification("Color Bonus ended!");
        }
    }
}

function calculatePayout(betType, betValue, winningNumber) {
    const betAmount = parseInt(betAmountInput.value);
    let multiplier = 1;
    
    // Apply Hot Number multiplier
    if (activeEvents.hotNumber !== null && winningNumber.number === activeEvents.hotNumber) {
        multiplier *= SPECIAL_EVENTS.hotNumber.multiplier;
    }
    
    // Apply Lucky Streak multiplier
    if (activeEvents.luckyStreak) {
        multiplier *= SPECIAL_EVENTS.luckyStreak.multiplier;
    }
    
    // Apply Color Bonus multiplier
    if (activeEvents.colorBonus !== null && winningNumber.color === activeEvents.colorBonus) {
        multiplier *= SPECIAL_EVENTS.colorBonus.multiplier;
    }
    
    if (betType === 'number') {
        if (winningNumber.number === betValue) {
            return Math.floor(betAmount * PAYOUTS.number * multiplier);
        }
    } else if (betType === 'color') {
        if (winningNumber.color === betValue) {
            return Math.floor(betAmount * PAYOUTS.color * multiplier);
        }
    }
    
    return 0;
}

function spinWheel() {
    if (isSpinning) return;

    const betAmount = parseInt(betAmountInput.value);
    
    // Check if player has enough balance
    if (betAmount > balance) {
        alert("Insufficient balance! Please reduce your bet.");
        return;
    }
    
    // Check if bet amount is valid
    if (isNaN(betAmount) || betAmount < 10 || betAmount > 1000) {
        alert("Please enter a valid bet amount between 10 and 1000.");
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    resultText.textContent = "Spinning...";

    // Deduct bet amount from balance
    balance -= betAmount;
    updateStats();

    // Determine winning number in advance
    const winningIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[winningIndex];
    const betNumber = parseInt(document.getElementById('betNumber').value);
    const betColor = document.getElementById('betColor').value;
    const selectedBetType = document.querySelector('input[name="betType"]:checked').value;

    // Validate bet
    if (selectedBetType === 'number' && (isNaN(betNumber) || betNumber < 0 || betNumber > 36)) {
        alert("Please enter a valid number between 0 and 36.");
        isSpinning = false;
        spinButton.disabled = false;
        balance += betAmount; // Refund the bet
        updateStats();
        return;
    }

    if (selectedBetType === 'color' && !betColor) {
        alert("Please select a valid color.");
        isSpinning = false;
        spinButton.disabled = false;
        balance += betAmount; // Refund the bet
        updateStats();
        return;
    }

    // Animation setup
    const initialSpins = 5; // Initial number of full rotations
    const sectionAngle = 360 / numbers.length;
    const stopAngle = (winningIndex * sectionAngle) + (sectionAngle / 2);
    
    // Three-phase animation
    let currentRotation = 0;
    
    // Phase 1: Fast rotation
    wheel.style.transition = "transform 2s cubic-bezier(0.2, 0, 0.8, 1)";
    currentRotation = -(initialSpins * 360);
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        // Phase 2: Slower rotation
        wheel.style.transition = "transform 1.5s cubic-bezier(0.1, 0, 0.9, 1)";
        currentRotation -= 720; // Additional 2 rotations
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        setTimeout(() => {
            // Phase 3: Final slowdown to winning number
            wheel.style.transition = "transform 2.5s cubic-bezier(0, 0, 0.2, 1)";
            currentRotation = -(initialSpins * 360 + stopAngle + 720);
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            
            // Show result after spinning completes
            setTimeout(() => {
                isSpinning = false;
                spinButton.disabled = false;

                // Calculate winnings
                const payout = calculatePayout(selectedBetType, 
                    selectedBetType === 'number' ? betNumber : betColor, 
                    winningNumber);
                
                let message = `Number: ${winningNumber.number} (${winningNumber.color})`;
                
                // Remove any existing win/lose classes
                resultText.classList.remove('win', 'lose');
                
                if (payout > 0) {
                    balance += payout + betAmount; // Return bet amount plus winnings
                    wins++;
                    message += `\nYou win ${payout}₽!`;
                    resultText.classList.add('win');
                } else {
                    losses++;
                    message += "\nYou lose!";
                    resultText.classList.add('lose');
                }
                
                updateStats();
                resultText.textContent = message;

                // Add to history
                const historyNumber = document.createElement("div");
                historyNumber.classList.add("history-number", winningNumber.color);
                historyNumber.textContent = winningNumber.number;
                
                // Add win/loss indicator
                const indicator = document.createElement("span");
                indicator.classList.add("result-indicator");
                indicator.textContent = payout > 0 ? "+" : "-";
                indicator.style.color = payout > 0 ? "#00ff00" : "#ff0000";
                historyNumber.appendChild(indicator);

                if (historyContainer.children.length >= 10) {
                    historyContainer.removeChild(historyContainer.lastChild);
                }
                historyContainer.insertBefore(historyNumber, historyContainer.firstChild);
                
                // Check if player is out of money
                if (balance < 10) {
                    setTimeout(() => {
                        if (confirm("You're out of money! Would you like to reset your balance to 1000₽?")) {
                            balance = 1000;
                            updateStats();
                        }
                    }, 1000);
                }

                // Update special events
                updateSpecialEvents();
            }, 2500);
        }, 1500);
    }, 2000);
}

// Event listeners
document.getElementById('betNumber').addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 36) this.value = 36;
    if (value < 0) this.value = 0;
});

document.getElementById('betAmount').addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 1000) this.value = 1000;
    if (value < 10) this.value = 10;
    if (value > balance) this.value = balance;
});

// Quick bet buttons
quickBetButtons.forEach(button => {
    button.addEventListener('click', function() {
        const amount = parseInt(this.getAttribute('data-amount'));
        betAmountInput.value = amount;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const betTypeRadios = document.querySelectorAll('input[name="betType"]');
    const numberBetDiv = document.getElementById('numberBet');
    const colorBetDiv = document.getElementById('colorBet');

    betTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'number') {
                numberBetDiv.style.display = 'block';
                colorBetDiv.style.display = 'none';
            } else {
                numberBetDiv.style.display = 'none';
                colorBetDiv.style.display = 'block';
            }
        });
    });
    
    // Animation end handler
    wheel.addEventListener('animationend', () => {
        if (wheel.classList.contains('spinning')) {
            wheel.style.transform = `rotate(${wheel.style.getPropertyValue('--final-rotation')})`;
        }
    });
    
    // Initialize the game
    drawNumbers();
    loadStats();
    spinButton.addEventListener('click', spinWheel);
});

// Add UI updates for special events
function updateUI() {
    // Update active events display
    const eventsContainer = document.getElementById('active-events');
    eventsContainer.innerHTML = '';
    
    if (activeEvents.hotNumber !== null) {
        const hotNumberEvent = document.createElement('div');
        hotNumberEvent.classList.add('active-event', 'hot-number');
        hotNumberEvent.innerHTML = `
            <span class="event-icon">🔥</span>
            <span class="event-text">Hot Number: ${activeEvents.hotNumber}</span>
            <span class="event-counter">${eventCounters.hotNumber}</span>
        `;
        eventsContainer.appendChild(hotNumberEvent);
    }
    
    if (activeEvents.luckyStreak) {
        const luckyStreakEvent = document.createElement('div');
        luckyStreakEvent.classList.add('active-event', 'lucky-streak');
        luckyStreakEvent.innerHTML = `
            <span class="event-icon">🍀</span>
            <span class="event-text">Lucky Streak</span>
            <span class="event-counter">${eventCounters.luckyStreak}</span>
        `;
        eventsContainer.appendChild(luckyStreakEvent);
    }
    
    if (activeEvents.colorBonus !== null) {
        const colorBonusEvent = document.createElement('div');
        colorBonusEvent.classList.add('active-event', 'color-bonus');
        colorBonusEvent.innerHTML = `
            <span class="event-icon">🎨</span>
            <span class="event-text">${activeEvents.colorBonus.charAt(0).toUpperCase() + activeEvents.colorBonus.slice(1)} Bonus</span>
            <span class="event-counter">${eventCounters.colorBonus}</span>
        `;
        eventsContainer.appendChild(colorBonusEvent);
    }
}

// Функция для открытия модального окна пополнения
function openDepositModal() {
    const modal = document.getElementById('deposit-modal');
    modal.classList.add('show');
}

// Функция для закрытия модального окна
function closeDepositModal() {
    const modal = document.getElementById('deposit-modal');
    modal.classList.remove('show');
}

// Функция для пополнения баланса
function deposit(amount) {
    const bonus = amount * 0.1; // 10% бонус
    const totalAmount = amount + bonus;
    
    balance += totalAmount;
    updateBalance();
    
    // Показываем уведомление о пополнении
    showNotification(`Баланс пополнен на ${amount}₽ + ${bonus}₽ бонус!`, 'success');
    
    // Закрываем модальное окно
    closeDepositModal();
}

// Функция для обработки пользовательского ввода суммы пополнения
function handleCustomDeposit() {
    const input = document.getElementById('custom-deposit-amount');
    const amount = parseInt(input.value);
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Пожалуйста, введите корректную сумму', 'error');
        return;
    }
    
    deposit(amount);
    input.value = '';
}

// Инициализация обработчиков событий для пополнения
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Обработчики для кнопки пополнения и модального окна
    const depositButton = document.getElementById('deposit-button');
    const closeModalButton = document.querySelector('.close-modal');
    const depositOptions = document.querySelectorAll('.deposit-option');
    const customDepositButton = document.querySelector('.custom-deposit button');
    
    depositButton.addEventListener('click', openDepositModal);
    closeModalButton.addEventListener('click', closeDepositModal);
    
    // Обработчики для предустановленных сумм пополнения
    depositOptions.forEach(option => {
        option.addEventListener('click', () => {
            const amount = parseInt(option.textContent);
            deposit(amount);
        });
    });
    
    // Обработчик для пользовательской суммы
    customDepositButton.addEventListener('click', handleCustomDeposit);
    
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('deposit-modal');
        if (event.target === modal) {
            closeDepositModal();
        }
    });
});

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем стили для уведомления
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease-out';
    
    // Устанавливаем цвет фона в зависимости от типа уведомления
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);