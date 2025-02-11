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

        // Добавим дополнительный поворот для числа, чтобы оно смотрело внутрь
        const rotationAngle = angle ;  // Сдвиг на 90 градусов для ориентации в центр
        number.style.transform = `rotate(${rotationAngle}deg)`;

        numberContainer.appendChild(number);
    });
}


function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;

    const winningIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[winningIndex];
    const betNumber = parseInt(document.getElementById('betNumber').value);
    const betColor = document.getElementById('betColor').value;

    if (isNaN(betNumber) || betNumber < 0 || betNumber > 36) {
        alert("Please enter a valid number between 0 and 36.");
        return;
    }
    
    if (!betColor || (betColor !== 'red' && betColor !== 'black' && betColor !== 'green')) {
        alert("Please select a valid color.");
        return;
    }

    const sectionAngle = 360 / numbers.length;
    const stopAngle = (winningIndex * sectionAngle) + (sectionAngle / 2);
    const spins = 5;
    const finalRotation = -(spins * 360 + stopAngle);
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;

        let message = `Number: ${winningNumber.number} (${winningNumber.color})`;

        if (winningNumber.number === betNumber) {
            message += "\nNumber match - You win!";
        }
        if (winningNumber.color === betColor) {
            message += "\nColor match - You win!";
        }

        resultText.textContent = message;

        const historyNumber = document.createElement("div");
        historyNumber.classList.add("history-number", winningNumber.color);
        historyNumber.textContent = winningNumber.number;

        if (historyContainer.children.length >= 10) {
            historyContainer.removeChild(historyContainer.lastChild);
        }
        historyContainer.insertBefore(historyNumber, historyContainer.firstChild);
    }, 4000);
}

document.getElementById('betNumber').addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 36) this.value = 36;
    if (value < 0) this.value = 0;
});

spinButton.addEventListener('click', spinWheel);
drawNumbers();
