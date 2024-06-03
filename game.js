const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dino = {
    x: 50,
    y: canvas.height - 70,
    width: 30,
    height: 30,
    velocityY: 0,
    gravity: 1,
    jumpPower: 15
};

const obstacles = [];
const foods = [];
let frame = 0;
let calories = 100;
let score = 0;
let gameRunning = true; // Variable pour suivre l'état du jeu
const calorieBar = document.getElementById('calorie-bar');
const scoreDisplay = document.getElementById('score');
const gameOverContainer = document.getElementById('game-over-container');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

document.addEventListener('keydown', function (event) {
    if (!gameRunning) {
        if (event.key === 'Enter') {
            resetGame();
        }
        return;
    }
    
    if (event.key === ' ' && dino.y === canvas.height - dino.height) {
        dino.velocityY = -dino.jumpPower;
    }
});

function resetGame() {
    frame = 0;
    calories = 100;
    score = 0;
    dino.y = canvas.height - dino.height;
    dino.velocityY = 0;
    obstacles.length = 0;
    foods.length = 0;
    gameOverContainer.classList.add('hidden');
    scoreDisplay.textContent = 'Score: 0';
    gameRunning = true; // Remettre le jeu en cours
    update();
}

function gameOver() {
    finalScore.textContent = 'Score: ' + score;
    gameOverContainer.classList.remove('hidden');
    gameRunning = false; // Arrêter le jeu
}

function update() {
    if (!gameRunning) return; // Si le jeu est terminé, arrêter la mise à jour
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update dino
    dino.y += dino.velocityY;
    if (dino.y < canvas.height - dino.height) {
        dino.velocityY += dino.gravity;
    } else {
        dino.y = canvas.height - dino.height;
        dino.velocityY = 0;
    }
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Add obstacles and foods
    if (frame % 100 === 0) {
        // Réduire la taille des obstacles générés aléatoirement
        const obstacleWidth = Math.random() * 50 + 20; // Largeur de l'obstacle entre 20 et 70 pixels
        const obstacleHeight = Math.random() * 50 + 20; // Hauteur de l'obstacle entre 20 et 70 pixels
        const foodHeight = Math.random() * (canvas.height - obstacleHeight - 100); // Hauteur de la nourriture entre le haut de l'écran et le sommet de l'obstacle
        obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight, width: obstacleWidth, height: obstacleHeight });
        foods.push({ x: canvas.width, y: foodHeight, width: 30, height: 30 });
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 5;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        } else {
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        }
    }
    
    // Update foods
    for (let i = foods.length - 1; i >= 0; i--) {
        foods[i].x -= 5;
        if (foods[i].x + foods[i].width < 0) {
            foods.splice(i, 1);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(foods[i].x, foods[i].y, foods[i].width, foods[i].height);
            ctx.fillStyle = 'black';
        }
    }
    
    // Check for collisions
    obstacles.forEach(obstacle => {
        if (dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y) {
            gameOver();
            return;
        }
    });
    
    foods.forEach((food, index) => {
        if (dino.x < food.x + food.width &&
            dino.x + dino.width > food.x &&
            dino.y < food.y + food.height &&
            dino.y + dino.height > food.y) {
            foods.splice(index, 1);
            calories = Math.min(100, calories + 20);
        }
    });
    
    // Update calorie bar
    calories -= 0.1;
    if (calories <= 0) {
        gameOver();
        return;
    }
    calorieBar.style.width = calories + '%';
    
    frame++;
    requestAnimationFrame(update);
}

restartButton.addEventListener('click', resetGame);

update();
