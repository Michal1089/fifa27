const player = document.getElementById("player");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const goalA = document.getElementById("a");
const goalB = document.getElementById("b");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const pauseScreen = document.getElementById("pauseScreen");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");

const redNameInput = document.getElementById("redName");
const blueNameInput = document.getElementById("blueName");
const scoreText = document.querySelector(".scoreboard h1");

const timerEl = document.getElementById("timer");
let matchTime = 90;
let timerInterval = null;

let redPlayerName = "Red";
let bluePlayerName = "Blue";

let playerX = window.innerWidth * 0.0;
let playerY = window.innerHeight * 0.5;
let player2X = window.innerWidth * 0.9;
let player2Y = window.innerHeight * 0.5;

let ballX = window.innerWidth * 0.45;
let ballY = window.innerHeight * 0.5;
let ballSpeedX = 0;
let ballSpeedY = 0;
let ballOwner = null;

let score1 = 0;
let score2 = 0;

let gameRunning = false;
let isPaused = false;

const friction = 0.97;
const speed = 6;
const keys = {};

function updateTimer() {
    const min = Math.floor(matchTime / 60);
    const sec = matchTime % 60;
    timerEl.textContent = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function endMatch() {
    gameRunning = false;
    clearInterval(timerInterval);
    pauseScreen.style.display = "flex";

    let result = "DRAW";
    if (score1 > score2) result = `${redPlayerName} WINS`;
    if (score2 > score1) result = `${bluePlayerName} WINS`;

    pauseScreen.innerHTML = `
        <h1>FULL TIME</h1>
        <h2>${result}</h2>
        <button onclick="location.reload()">NEW MATCH</button>
    `;
}


function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && gameRunning) {
            matchTime--;
            updateTimer();

            if (matchTime <= 0) {
                endMatch();
            }
        }
    }, 1000);
}

document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === "Escape") {
        isPaused = !isPaused;
        pauseScreen.style.display = isPaused ? "flex" : "none";
    }
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

startBtn.onclick = () => {
    redPlayerName = redNameInput.value.trim() || "Red";
    bluePlayerName = blueNameInput.value.trim() || "Blue";
    matchTime = parseInt(matchTimeSelect.value);
    menu.style.display = "none";
    gameRunning = true;
    updateScore();
    updateTimer();
    startTimer();
};

resumeBtn.onclick = () => {
    isPaused = false;
    pauseScreen.style.display = "none";
};

restartBtn.onclick = () => {
    score1 = 0;
    score2 = 0;
    resetBall();
    playerX = window.innerWidth * 0.0;
    playerY = window.innerHeight * 0.5;
    player2X = window.innerWidth * 0.9;
    player2Y = window.innerHeight * 0.5;
    matchTime = parseInt(matchTimeSelect.value);
    updateScore();
    updateTimer();
    startTimer();
    isPaused = false;
    pauseScreen.style.display = "none";
};

function updateScore() {
    scoreText.textContent = `${redPlayerName}  ${score1} - ${score2}  ${bluePlayerName}`;
}

function resetBall() {
    ballX = window.innerWidth * 0.45;
    ballY = window.innerHeight * 0.5;
    ballSpeedX = 0;
    ballSpeedY = 0;
    ballOwner = null;
}

function isTouching(px, py, bx, by) {
    return Math.hypot(px - bx, py - by) < 60;
}

function shoot(rotation) {
    const power = 12;
    const rad = rotation * Math.PI / 180;
    ballSpeedX = Math.cos(rad) * power;
    ballSpeedY = Math.sin(rad) * power;
    ballOwner = null;
}

function isCollidingBall(ballEl, goalEl) {
    const b = ballEl.getBoundingClientRect();
    const g = goalEl.getBoundingClientRect();
    return !(b.right < g.left || b.left > g.right || b.bottom < g.top || b.top > g.bottom);
}

function checkGoal() {
    if (isCollidingBall(ball, goalA)) {
        score2++;
        updateScore();
        resetBall();
    }
    if (isCollidingBall(ball, goalB)) {
        score1++;
        updateScore();
        resetBall();
    }
}

function updatePlayers() {
    if (keys["w"]) playerY -= speed;
    if (keys["s"]) playerY += speed;
    if (keys["a"]) playerX -= speed;
    if (keys["d"]) playerX += speed;

    if (keys["ArrowUp"]) player2Y -= speed;
    if (keys["ArrowDown"]) player2Y += speed;
    if (keys["ArrowLeft"]) player2X -= speed;
    if (keys["ArrowRight"]) player2X += speed;

    playerX = Math.max(0, Math.min(playerX, window.innerWidth - 80));
    playerY = Math.max(0, Math.min(playerY, window.innerHeight - 80));
    player2X = Math.max(0, Math.min(player2X, window.innerWidth - 80));
    player2Y = Math.max(0, Math.min(player2Y, window.innerHeight - 80));

    if (keys["w"]) player.style.transform = "rotate(-90deg)";
    if (keys["s"]) player.style.transform = "rotate(90deg)";
    if (keys["a"]) player.style.transform = "rotate(180deg)";
    if (keys["d"]) player.style.transform = "rotate(0deg)";

    if (keys["ArrowUp"]) player2.style.transform = "rotate(90deg)";
    if (keys["ArrowDown"]) player2.style.transform = "rotate(-90deg)";
    if (keys["ArrowLeft"]) player2.style.transform = "rotate(0deg)";
    if (keys["ArrowRight"]) player2.style.transform = "rotate(180deg)";

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    player2.style.left = player2X + "px";
    player2.style.top = player2Y + "px";

    if (isTouching(playerX, playerY, ballX, ballY)) ballOwner = "p1";
    if (isTouching(player2X, player2Y, ballX, ballY)) ballOwner = "p2";

    if (keys[" "] && ballOwner === "p1") {
        const rot = parseInt(player.style.transform.replace(/[^0-9\-]/g, "")) || 0;
        shoot(rot);
    }

    if (keys["Enter"] && ballOwner === "p2") {
        const rot = parseInt(player2.style.transform.replace(/[^0-9\-]/g, "")) || 0;
        shoot(rot + 180);
    }
}

function updateBall() {
    if (ballOwner === "p1") {
        ballX = playerX + 25;
        ballY = playerY + 25;
    } else if (ballOwner === "p2") {
        ballX = player2X + 25;
        ballY = player2Y + 25;
    } else {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        ballSpeedX *= friction;
        ballSpeedY *= friction;
        if (Math.abs(ballSpeedX) < 0.1) ballSpeedX = 0;
        if (Math.abs(ballSpeedY) < 0.1) ballSpeedY = 0;
        if (ballX <= 0 || ballX >= window.innerWidth - 50) ballSpeedX *= -1;
        if (ballY <= 0 || ballY >= window.innerHeight - 50) ballSpeedY *= -1;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
    checkGoal();
}

function gameLoop() {
    if (gameRunning && !isPaused) {
        updatePlayers();
        updateBall();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
