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
    chargeJumpPower: 30 // Puissance du saut chargé
};

const obstacles = [];
const foods = [];
let frame = 0;
let calories = 100;
let score = 0;
let gameRunning = true;
let tickSinceLastObstacle = 0;
let nextObstacle = 0;
let tickSinceLastFood = 0;
let nextFood = 0;

const calorieBar = document.getElementById('calorie-bar');
const jumpBar = document.getElementById('jump-bar');
const scoreDisplay = document.getElementById('score');
const gameOverContainer = document.getElementById('game-over-container');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

var jumpKeyBind = ' ';
var chargeKeyBind = 'Shift';

document.getElementById('updateKB').addEventListener('click', function (e) {
    e.preventDefault();
    jumpKeyBind = document.getElementById('jump-key').value;
    chargeKeyBind = document.getElementById('charge-key').value;
    document.getElementById('input-container').classList.add('hidden');
    gameRunning = true;
    }
);
document.getElementById('options-button').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('input-container').classList.toggle('hidden');
    gameRunning = !gameRunning;
});

document.getElementById('jump-key').addEventListener('keydown', function (e) {
    e.preventDefault();
    e.target.value = e.key;
});

document.getElementById('charge-key').addEventListener('keydown', function (e) {
    e.preventDefault();
    e.target.value = e.key;
});


document.addEventListener('keydown', function (event) {
    if (!gameRunning && event.key === 'Enter') {
        resetGame();
    }

    if (event.key === chargeKeyBind) {
        dino.isChargingJump = true; // Commence le chargement du saut
    }

    if (event.key === jumpKeyBind && dino.jumps < dino.maxJumps) {
        // Saut normal à tout moment
        dino.velocityY = -dino.jumpPower;
        dino.jumps++;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === chargeKeyBind && dino.isChargingJump) {
        dino.isChargingJump = false;
        if (dino.jumpCharge >= dino.maxJumpCharge) {
            // Saut chargé
            dino.velocityY = -dino.chargeJumpPower;
            dino.jumpCharge = 0;
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

function update() {
    if (gameRunning){

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

        // Add obstacles

        if (tickSinceLastObstacle > nextObstacle && Math.random() < 0.07) {
            // Générer le gros cube en haut avec une faible probabilité
            if (Math.random() < 0.1) {
                const bigCubeWidth = 100;
                const bigCubeHeight = 100;
                obstacles.push({ x: Math.random() * (canvas.width - bigCubeWidth), y: 0, width: bigCubeWidth, height: bigCubeHeight });
            } else {
                // Générer des obstacles
                const obstacleWidth = Math.random() * 50 + 20;
                const obstacleHeight = Math.random() * 50 + 20;
                const obstacleX = canvas.width;
                const obstacleY = canvas.height - obstacleHeight;

                obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight });
                tickSinceLastObstacle = 0;
                nextObstacle = Math.floor(Math.random() * 200 + 20);
            }
        }
        tickSinceLastObstacle++;
        

        //Adds food
        if (tickSinceLastFood > nextFood && Math.random() < 0.015) {
            const foodWidth = 20;
            const foodHeight = 20;
            const foodX = canvas.width;
            const foodY = (canvas.height * 0.4) + Math.random() * (canvas.height * 0.5 - foodHeight);
            var random = Math.random();
            if (random < 0.55) {
                foodType = 'fat'
            } else if (random < 0.85) {
                foodType = 'fit'
            } else {
                foodType = 'boost'
            }
            foods.push({ x: foodX, y: foodY, width: foodWidth, height: foodHeight, type: foodType });
            tickSinceLastFood = 0;
            nextFood = Math.floor(Math.random() * 250 + 20);
        }
        tickSinceLastFood++;

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
                if (foods[i].type === 'fat') {
                ctx.fillStyle = 'red';
                } else if (foods[i].type === 'fit') {
                    ctx.fillStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                }
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
                if (food.type === 'fat') {
                    calories = Math.min(100, calories + 50);
                } else if (food.type === 'fit') {
                    calories = Math.min(100, calories + 20);
                } else {
                    // Boost
                }
                foods.splice(index, 1);
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
    }
    requestAnimationFrame(update);
}

restartButton.addEventListener('click', resetGame);

update();
