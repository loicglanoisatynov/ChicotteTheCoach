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
    chargeJumpPower: 30,
    speed: 5,
    speedBoost: 0,
    speedBoostDuration: 0
};

const obstacles = [];
const bonuses = [];
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
const BonusSound = document.getElementById('bonus-sound');
const DebuffsSound = document.getElementById('debuffs-sound'); 

const bonusTypes = {
    BOOST: 'BOOST',
    FAT: 'FAT',
    FIT: 'FIT'
};

const bonusData = {
    BOOST: { calories: 0, speedBoost: 2, duration: 100, color: 'blue' },
    FAT: { calories: 40, speedBoost: -1, duration: 50, color: 'brown' },
    FIT: { calories: 20, speedBoost: 1, duration: 50, color: 'green' }
};

const bonusItems = {
    BOOST: ['barre de céréales', 'pot de protéines', 'boisson énergisante'],
    FAT: ['Burger', 'Donut', 'Pizza'],
    FIT: ['Pomme', 'Banane', 'Tomate', 'Oeufs', 'Salade']
};

document.addEventListener('keydown', function (event) {
    if (!gameRunning) {
        if (event.key === 'Enter') {
            resetGame();
        }
        return;
    }

    if (event.key === 'Shift') {
        dino.isChargingJump = true; // Commence le chargement du saut
    }

    if (event.key === ' ' && dino.jumps < dino.maxJumps) {
        // Saut normal à tout moment
        dino.velocityY = -dino.jumpPower;
        dino.jumps++;
        playSound(jumpSound); // Jouer le son du saut
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
    dino.speed = 5;
    dino.speedBoost = 0;
    dino.speedBoostDuration = 0;
    obstacles.length = 0;
    bonuses.length = 0;
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

function getRandomBonusType() {
    const types = Object.keys(bonusTypes);
    return bonusTypes[types[Math.floor(Math.random() * types.length)]];
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

    // Add obstacles and bonuses
    if (frame % 100 === 0) {
        const obstacleWidth = Math.random() * 50 + 20;
        const obstacleHeight = Math.random() * 50 + 20;
        const obstacleX = canvas.width;
        const obstacleY = canvas.height - obstacleHeight;

        obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight });

        if (Math.random() < 0.5) {
            const bonusType = getRandomBonusType();
            bonuses.push({
                x: obstacleX,
                y: obstacleY - 40,
                width: 30,
                height: 30,
                type: bonusType
            });
        }
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= dino.speed + dino.speedBoost;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        } else {
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        }
    }

    // Update bonuses
    for (let i = bonuses.length - 1; i >= 0; i--) {
        bonuses[i].x -= dino.speed + dino.speedBoost;
        if (bonuses[i].x + bonuses[i].width < 0) {
            bonuses.splice(i, 1);
        } else {
            ctx.fillStyle = bonusData[bonuses[i].type].color;
            ctx.fillRect(bonuses[i].x, bonuses[i].y, bonuses[i].width, bonuses[i].height);
            ctx.fillStyle = 'black';
        }
    }

    // Apply speed boost effects
    if (dino.speedBoostDuration > 0) {
        dino.speedBoostDuration--;
        if (dino.speedBoostDuration === 0) {
            dino.speedBoost = 0;
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

    bonuses.forEach((bonus, index) => {
        if (dino.x < bonus.x + bonus.width &&
            dino.x + dino.width > bonus.x &&
            dino.y < bonus.y + bonus.height &&
            dino.y + dino.height > bonus.y) {
            bonuses.splice(index, 1);

            const effect = bonusData[bonus.type];
            calories = Math.min(100, calories + effect.calories);
            dino.speedBoost = effect.speedBoost;
            dino.speedBoostDuration = effect.duration;
            playSound(bonus-sound); // Jouer le son lorsqu'un bonus est récupéré
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