const player = document.getElementById("player");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const a = document.getElementById("a");
const b = document.getElementById("b");
const scoreText = document.querySelector("h1");

let playerX = window.innerWidth * 0.0; playerY = window.innerHeight * 0.5;
let player2X = window.innerWidth * 0.9; player2Y = window.innerHeight * 0.5;
let ballX = window.innerWidth * 0.45; ballY = window.innerHeight * 0.5;
let ballOwner = null;
let score1 = 0; score2 = 0;


function isCollidingBall(ball, goal) {
    const h = ball.getBoundingClientRect();
    const g = goal.getBoundingClientRect();

    return !(
        h.right < g.left ||
        h.left > g.right ||
        h.bottom < g.top ||
        h.top > g.bottom
    );
}

function resetBall() {
    ballX = window.innerWidth * 0.45; ballY = window.innerHeight * 0.5;
    ballOwner = null;
    updateBall();
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

    scoreText.textContent = `Score: ${score1} - ${score2}`;
}

function updateBall() {
    if (ballOwner === "p1") {
        ballX = playerX + 10;
        ballY = playerY + 10;
    }
    if (ballOwner === "p2") {
        ballX = player2X + 10;
        ballY = player2Y + 10;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function isTouching(px, py, bx, by) {
    const distance = Math.hypot(px - bx, py - by);
    return distance < 60;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "w") {
        playerY -= 10;
        player.style.transform = "rotate(-90deg)";
    }
    if (e.key === "s") {
        playerY += 10;
        player.style.transform = "rotate(90deg)";
    }
    if (e.key === "a") {
        playerX -= 10;
        player.style.transform = "rotate(180deg)";
    }
    if (e.key === "d") {
        playerX += 10;
        player.style.transform = "rotate(0deg)";
    }

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    if (isTouching(playerX, playerY, ballX, ballY)) {
        ballOwner = "p1";
    }


    if (e.key === "ArrowUp") {
        player2Y -= 10;
        player2.style.transform = "rotate(90deg)";
    }
    if (e.key === "ArrowDown") {
        player2Y += 10;
        player2.style.transform = "rotate(-90deg)";
    }
    if (e.key === "ArrowLeft") {
        player2X -= 10;
        player2.style.transform = "rotate(0deg)";
    }
    if (e.key === "ArrowRight") {
        player2X += 10;
        player2.style.transform = "rotate(180deg)";
    }

    player2.style.left = player2X + "px";
    player2.style.top = player2Y + "px";

    if (isTouching(player2X, player2Y, ballX, ballY)) {
        ballOwner = "p2";
    }

    updateBall();
    checkGoal();
});
