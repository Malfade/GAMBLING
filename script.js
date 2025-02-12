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

const wheel = document.getElementById("wheel");
const numberContainer = document.getElementById("number-container");
const spinButton = document.getElementById("spinButton");
const resultText = document.getElementById("result");
const historyContainer = document.getElementById("history");
let isSpinning = false;

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

function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultText.textContent = "Spinning...";

    // Определяем выигрышный номер заранее
    const winningIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[winningIndex];
    const betNumber = parseInt(document.getElementById('betNumber').value);
    const betColor = document.getElementById('betColor').value;
    const selectedBetType = document.querySelector('input[name="betType"]:checked').value;

    // Проверка валидности ставки
    if (selectedBetType === 'number' && (isNaN(betNumber) || betNumber < 0 || betNumber > 36)) {
        alert("Please enter a valid number between 0 and 36.");
        isSpinning = false;
        spinButton.disabled = false;
        return;
    }

    if (selectedBetType === 'color' && !betColor) {
        alert("Please select a valid color.");
        isSpinning = false;
        spinButton.disabled = false;
        return;
    }

    // Настройка анимации
    const initialSpins = 5; // Начальное количество полных оборотов
    const sectionAngle = 360 / numbers.length;
    const stopAngle = (winningIndex * sectionAngle) + (sectionAngle / 2);
    
    // Анимация в три фазы
    let currentRotation = 0;
    
    // Фаза 1: Быстрое вращение
    wheel.style.transition = "transform 2s cubic-bezier(0.2, 0, 0.8, 1)";
    currentRotation = -(initialSpins * 360);
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        // Фаза 2: Более медленное вращение
        wheel.style.transition = "transform 1.5s cubic-bezier(0.1, 0, 0.9, 1)";
        currentRotation -= 720; // Дополнительные 2 оборота
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        setTimeout(() => {
            // Фаза 3: Финальное замедление до выигрышного числа
            wheel.style.transition = "transform 2.5s cubic-bezier(0, 0, 0.2, 1)";
            currentRotation = -(initialSpins * 360 + stopAngle + 720);
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            
            // Показываем результат после завершения вращения
            setTimeout(() => {
                isSpinning = false;
                spinButton.disabled = false;

                let message = `Number: ${winningNumber.number} (${winningNumber.color})`;

                if (selectedBetType === 'number' && winningNumber.number === betNumber) {
                    message += "\nNumber match - You win!";
                } else if (selectedBetType === 'color' && winningNumber.color === betColor) {
                    message += "\nColor match - You win!";
                } else {
                    message += "\nNo match - You lose!";
                }

                resultText.textContent = message;

                const historyNumber = document.createElement("div");
                historyNumber.classList.add("history-number", winningNumber.color);
                historyNumber.textContent = winningNumber.number;

                if (historyContainer.children.length >= 10) {
                    historyContainer.removeChild(historyContainer.lastChild);
                }
                historyContainer.insertBefore(historyNumber, historyContainer.firstChild);
            }, 2500);
        }, 1500);
    }, 2000);
}

document.getElementById('betNumber').addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 36) this.value = 36;
    if (value < 0) this.value = 0;
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
// Обработчик окончания анимации
wheel.addEventListener('animationend', () => {
    if (wheel.classList.contains('spinning')) {
        wheel.style.transform = `rotate(${wheel.style.getPropertyValue('--final-rotation')})`;
    }
});
    drawNumbers();
    spinButton.addEventListener('click', spinWheel);
});