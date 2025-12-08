const player = document.getElementById("player");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const a = document.getElementById("a");
const b = document.getElementById("b");
const scoreText = document.querySelector("h1");

let playerX = window.innerWidth * 0.0, playerY = window.innerHeight * 0.5;
let player2X = window.innerWidth * 0.9, player2Y = window.innerHeight * 0.5;

let ballX = window.innerWidth * 0.45, ballY = window.innerHeight * 0.5;
let ballOwner = null;

let score1 = 0, score2 = 0;
let ballSpeedX = 0, ballSpeedY = 0;
const friction = 0.97;
const speed = 6;

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function isCollidingBall(ball, goal) {
    const h = ball.getBoundingClientRect();
    const g = goal.getBoundingClientRect();
    return !(h.right < g.left || h.left > g.right || h.bottom < g.top || h.top > g.bottom);
}

function resetBall() {
    ballX = window.innerWidth * 0.45;
    ballY = window.innerHeight * 0.5;
    ballSpeedX = 0;
    ballSpeedY = 0;
    ballOwner = null;
}

function checkGoal() {
    if (isCollidingBall(ball, a)) {
        score2++;
        resetBall();
    }
    if (isCollidingBall(ball, b)) {
        score1++;
        resetBall();
    }
    scoreText.textContent = `Red  ${score1} - ${score2}  Blue`;
}

function isTouching(px, py, bx, by) {
    const distance = Math.hypot(px - bx, py - by);
    return distance < 60;
}

function shoot(playerRotation) {
    ballOwner = null;
    const power = 12;
    const rad = playerRotation * (Math.PI / 180);
    ballSpeedX = Math.cos(rad) * power;
    ballSpeedY = Math.sin(rad) * power;
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

    if (keys[" "]) {
        if (ballOwner === "p1") {
            let rotation = parseInt(player.style.transform.replace(/[^0-9\-]/g, "")) || 0;
            shoot(rotation);
        }
    }

    if (keys["Enter"]) {
        if (ballOwner === "p2") {
            let rotation = parseInt(player2.style.transform.replace(/[^0-9\-]/g, "")) || 0;
            shoot(rotation + 180);
        }
    }
}

function updateBall() {
    if (ballOwner === "p1") {
        ballX = playerX + 25;
        ballY = playerY + 25;
    }
    if (ballOwner === "p2") {
        ballX = player2X + 25;
        ballY = player2Y + 25;
    }

    if (ballOwner === null) {
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
    updatePlayers();
    updateBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();
