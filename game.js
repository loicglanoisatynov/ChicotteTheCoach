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
    jumpPower: 15,
    jumps: 0,
    maxJumps: 2,
    isChargingJump: false,
    jumpCharge: 0,
    maxJumpCharge: 100,
    chargeJumpPower: 30 
};

const obstacles = [];
const foods = [];
let frame = 0;
let calories = 100;
let score = 0;
let gameRunning = true;
const calorieBar = document.getElementById('calorie-bar');
const jumpBar = document.getElementById('jump-bar');
const scoreDisplay = document.getElementById('score');
const gameOverContainer = document.getElementById('game-over-container');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const foodSound = document.getElementById('food-sound'); 
const jumpSound = document.getElementById('jump-sound'); 

document.addEventListener('keydown', function (event) {
    if (!gameRunning) {
        if (event.key === 'Enter') {
            resetGame();
        }
        return;
    }

    if (event.key === 'Shift') {
        dino.isChargingJump = true; 
    }

    if (event.key === ' ' && dino.jumps < dino.maxJumps) {
        dino.velocityY = -dino.jumpPower;
        dino.jumps++;
        playSound(jumpSound); 
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Shift' && dino.isChargingJump) {
        dino.isChargingJump = false;
        if (dino.jumpCharge >= dino.maxJumpCharge) {
            // Saut chargé
            dino.velocityY = -dino.chargeJumpPower;
            dino.jumpCharge = 0;
            playSound(jumpSound); // Jouer le son du saut
        }
    }
});

function resetGame() {
    frame = 0;
    calories = 100;
    score = 0;
    dino.y = canvas.height - dino.height;
    dino.velocityY = 0;
    dino.jumps = 0;
    dino.jumpCharge = 0;
    dino.isChargingJump = false;
    obstacles.length = 0;
    foods.length = 0;
    gameOverContainer.classList.add('hidden');
    scoreDisplay.textContent = 'Score: 0';
    gameRunning = true;
    update();
}

function gameOver() {
    finalScore.textContent = 'Score: ' + score;
    gameOverContainer.classList.remove('hidden');
    gameRunning = false;
}

function playSound(sound) {
    const clone = sound.cloneNode();
    clone.play();
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update dino
    dino.y += dino.velocityY;
    if (dino.y < canvas.height - dino.height) {
        dino.velocityY += dino.gravity;
    } else {
        dino.y = canvas.height - dino.height;
        dino.velocityY = 0;
        dino.jumps = 0;
    }
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Charger le saut
    if (dino.isChargingJump) {
        dino.jumpCharge += 2; // Vitesse de chargement
        if (dino.jumpCharge > dino.maxJumpCharge) {
            dino.jumpCharge = dino.maxJumpCharge;
        }
    }
    jumpBar.style.width = (dino.jumpCharge / dino.maxJumpCharge) * 100 + '%';

    // Add obstacles and foods
    if (frame % 100 === 0) {
        // Générer le gros cube en haut avec une faible probabilité
        if (Math.random() < 0.1) {
            const bigCubeWidth = 100;
            const bigCubeHeight = 100;
            obstacles.push({ x: Math.random() * (canvas.width - bigCubeWidth), y: 0, width: bigCubeWidth, height: bigCubeHeight });
        } else {
            // Générer des obstacles et des aliments normaux
            const obstacleWidth = Math.random() * 50 + 20;
            const obstacleHeight = Math.random() * 50 + 20;
            const obstacleX = canvas.width;
            const obstacleY = canvas.height - obstacleHeight;

            obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight });
            foods.push({ x: obstacleX, y: obstacleY - 40, width: 30, height: 30 });
        }
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
            playSound(foodSound); // Jouer le son lorsqu'un aliment est récupéré
        }
    });


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
