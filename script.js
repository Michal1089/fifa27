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

let playerX = window.innerWidth * 0.05;
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

const baseSpeed = 6;
const sprintMultiplier = 1.7;
const friction = 0.97;
const stealDistance = 55;
const foulDistance = 40;

let foulCooldown = false;
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
    pauseScreen.innerHTML = `<h1>FULL TIME</h1><h2>${result}</h2><button onclick="location.reload()">NEW MATCH</button>`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && gameRunning) {
            matchTime--;
            updateTimer();
            if (matchTime <= 0) endMatch();
        }
    }, 1000);
}

function callFoul(victim) {
    isPaused = true;
    foulCooldown = true;
    pauseScreen.style.display = "flex";
    pauseScreen.innerHTML = `<h1>FOUL</h1><h2>${victim}</h2>`;
    setTimeout(() => {
        pauseScreen.style.display = "none";
        isPaused = false;
        foulCooldown = false;
    }, 1500);
}

document.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (e.code === "Escape") {
        isPaused = !isPaused;
        pauseScreen.style.display = isPaused ? "flex" : "none";
    }
});

document.addEventListener("keyup", e => {
    keys[e.code] = false;
});

startBtn.onclick = () => {
    redPlayerName = redNameInput.value.trim() || "Red";
    bluePlayerName = blueNameInput.value.trim() || "Blue";
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
    matchTime = 90;
    updateScore();
    updateTimer();
    startTimer();
    isPaused = false;
    pauseScreen.style.display = "none";
};

function updateScore() {
    scoreText.textContent = `${redPlayerName} ${score1} - ${score2} ${bluePlayerName}`;
}

function resetBall() {
    ballX = window.innerWidth * 0.45;
    ballY = window.innerHeight * 0.5;
    ballSpeedX = 0;
    ballSpeedY = 0;
    ballOwner = null;
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
    let speed1 = baseSpeed;
    let speed2 = baseSpeed;

    if (keys["ShiftLeft"]) speed1 *= sprintMultiplier;
    if (keys["ShiftRight"]) speed2 *= sprintMultiplier;

    if (keys["KeyW"]) { playerY -= speed1; player.style.transform = "rotate(-90deg)"; }
    if (keys["KeyS"]) { playerY += speed1; player.style.transform = "rotate(90deg)"; }
    if (keys["KeyA"]) { playerX -= speed1; player.style.transform = "rotate(180deg)"; }
    if (keys["KeyD"]) { playerX += speed1; player.style.transform = "rotate(0deg)"; }

    if (keys["ArrowUp"]) { player2Y -= speed2; player2.style.transform = "rotate(90deg)"; }
    if (keys["ArrowDown"]) { player2Y += speed2; player2.style.transform = "rotate(-90deg)"; }
    if (keys["ArrowLeft"]) { player2X -= speed2; player2.style.transform = "rotate(0deg)"; }
    if (keys["ArrowRight"]) { player2X += speed2; player2.style.transform = "rotate(180deg)"; }

    playerX = Math.max(0, Math.min(playerX, window.innerWidth - 80));
    playerY = Math.max(0, Math.min(playerY, window.innerHeight - 80));
    player2X = Math.max(0, Math.min(player2X, window.innerWidth - 80));
    player2Y = Math.max(0, Math.min(player2Y, window.innerHeight - 80));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    player2.style.left = player2X + "px";
    player2.style.top = player2Y + "px";

    const p1cx = playerX + 40;
const p1cy = playerY + 40;
const p2cx = player2X + 40;
const p2cy = player2Y + 40;

const dist = Math.hypot(p1cx - p2cx, p1cy - p2cy);


    if (!foulCooldown && keys["KeyF"]) {
        if (ballOwner === "p2" && dist < foulDistance) { callFoul(bluePlayerName); ballOwner = "p2"; return; }
        if (ballOwner === "p1" && dist < foulDistance) { callFoul(redPlayerName); ballOwner = "p1"; return; }
    }

    if (ballOwner === "p2" && dist < stealDistance && !keys["KeyF"]) ballOwner = "p1";
    else if (ballOwner === "p1" && dist < stealDistance && !keys["KeyF"]) ballOwner = "p2";

    if (ballOwner === null) {
        if (Math.hypot(playerX - ballX, playerY - ballY) < 50) ballOwner = "p1";
        if (Math.hypot(player2X - ballX, player2Y - ballY) < 50) ballOwner = "p2";
    }

    if (keys["Space"] && ballOwner === "p1") shoot(parseInt(player.style.transform.replace(/[^0-9\-]/g,"")) || 0);
    if (keys["Enter"] && ballOwner === "p2") shoot((parseInt(player2.style.transform.replace(/[^0-9\-]/g,"")) || 0) + 180);
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

        const ballSize = 50;

        if (ballX <= 0) {
            ballX = 0;
            ballSpeedX *= -1;
        }
        if (ballX + ballSize >= window.innerWidth) {
            ballX = window.innerWidth - ballSize;
            ballSpeedX *= -1;
        }
        if (ballY <= 0) {
            ballY = 0;
            ballSpeedY *= -1;
        }
        if (ballY + ballSize >= window.innerHeight) {
            ballY = window.innerHeight - ballSize;
            ballSpeedY *= -1;
        }

        ballSpeedX *= friction;
        ballSpeedY *= friction;
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
