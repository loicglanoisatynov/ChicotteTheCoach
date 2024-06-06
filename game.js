const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dino = {
    x: 200,
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
    speed: 4,
    speedBoost: 0,
    speedBoostDuration: 0
};

const obstacles = [];
const bonuses = [];
let frame = 0;
let calories = 100;
let score = 0;
let gameRunning = false; // Change to false to start with the menu
let tickSinceLastObstacle = 0;
let nextObstacle = 0;
let tickSinceLastFood = 0;
let nextFood = 0;
let gameSpeed = 5;

const calorieBar = document.getElementById('calorie-bar');
const jumpBar = document.getElementById('jump-bar');
const scoreDisplay = document.getElementById('score');
const gameOverContainer = document.getElementById('game-over-container');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const returnToMenuButton = document.getElementById('return-to-menu-button');
const foodSound = document.getElementById('food-sound');
const jumpSound = document.getElementById('jump-sound');
const buffSound = document.getElementById('buff-sound');
const debuffSound = document.getElementById('debuff-sound');
const scoreboardContainer = document.getElementById('scoreboard');

const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const menuOptionsButton = document.getElementById('menu-options-button');
const inputContainer = document.getElementById('input-container');
const optionsButton = document.getElementById('options-button');
const returnButton = document.getElementById('return-button');
const usernameInput = document.getElementById('username');

const bonusTypes = {
    BOOST: 'BOOST',
    FAT: 'FAT',
    FIT: 'FIT'
};

const bonusData = {
    BOOST: {calories: 0, speedBoost: 2, duration: 100, color: 'blue', sound: buffSound},
    FAT: {calories: 40, speedBoost: -1, duration: 50, color: 'brown', sound: debuffSound},
    FIT: {calories: 20, speedBoost: 1, duration: 50, color: 'green', sound: buffSound}
};

const bonusItems = {
    BOOST: ['barre de céréales', 'pot de protéines', 'boisson énergisante'],
    FAT: ['Burger', 'Donut', 'Pizza'],
    FIT: ['Pomme', 'Banane', 'Tomate', 'Oeufs', 'Salade']
};

var jumpKeyBind = ' ';
var chargeKeyBind = 'Shift';


document.getElementById('updateKB').addEventListener('click', function (e) {
    e.preventDefault();
    if (document.getElementById('jump-key').value != '') {
        jumpKeyBind = document.getElementById('jump-key').value;
    }
    if (document.getElementById('charge-key').value != '') {
        chargeKeyBind = document.getElementById('charge-key').value;
    }
    inputContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

returnButton.addEventListener('click', function (e) {
    e.preventDefault();
    inputContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

optionsButton.addEventListener('click', function (e) {
    e.preventDefault();
    inputContainer.classList.toggle('hidden');
    gameRunning = !gameRunning;
});

menuOptionsButton.addEventListener('click', function (e) {
    e.preventDefault();
    mainMenu.classList.add('hidden');
    inputContainer.classList.remove('hidden');
});

startButton.addEventListener('click', function (e) {
    e.preventDefault();
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resetGame();
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
        dino.isChargingJump = true;
    }

    if (event.key === jumpKeyBind && dino.jumps < dino.maxJumps) {
        dino.velocityY = -dino.jumpPower;
        dino.jumps++;
        playSound(jumpSound);
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === chargeKeyBind) {
        if (dino.isChargingJump) {
            dino.velocityY = -dino.chargeJumpPower * (dino.jumpCharge / dino.maxJumpCharge);
            dino.jumps++;
            dino.isChargingJump = false;
            dino.jumpCharge = 0;
            playSound(jumpSound);
        }
    }
});

function resetGame() {
    dino.x = 200;
    dino.y = canvas.height - dino.height;
    dino.velocityY = 0;
    dino.jumps = 0;
    dino.isChargingJump = false;
    dino.speed = 5;
    dino.speedBoost = 0;
    dino.speedBoostDuration = 0;
    obstacles.length = 0;
    bonuses.length = 0;
    gameOverContainer.classList.add('hidden');
    scoreDisplay.textContent = 'Score: 0';
    gameRunning = true;
    calories = 100;
    score = 0;
    tickSinceLastObstacle = 0;
    nextObstacle = Math.floor(Math.random() * 200 + 20);
    tickSinceLastFood = 0;
    nextFood = Math.floor(Math.random() * 250 + 50);
    update();
}

function gameOver() {
    const username = usernameInput.value || 'Anonyme';
    updateScoreboard(username, score);
    finalScore.textContent = 'Score: ' + score;
    gameOverContainer.classList.remove('hidden');
    gameRunning = false;
}

function updateScoreboard(username, score) {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
    scoreboard.push({username, score});
    scoreboard.sort((a, b) => b.score - a.score);
    if (scoreboard.length > 10) {
        scoreboard.pop();
    }
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
    displayScoreboard(scoreboard);
}

function displayScoreboard(scoreboard) {
    scoreboardContainer.innerHTML = '<h2>Tableau des scores</h2><ul>' +
        scoreboard.map(entry => `<li>${entry.username}: ${entry.score}</li>`).join('') +
        '</ul>';
}

function playSound(sound) {
    const clone = sound.cloneNode();
    clone.play();
}

function getRandomBonusType() {
    const types = Object.keys(bonusTypes);
    return bonusTypes[types[Math.floor(Math.random() * types.length)]];
}

const backgroundImage = new Image();
backgroundImage.src = 'image/city_background.png';

const cloudImages = [
    { image: new Image(), x: canvas.width, y: 50, speed: 2 },
    { image: new Image(), x: canvas.width * 1.5, y: 150, speed: 1.5 },
];

cloudImages[0].image.src = 'image/cloud1.png';
cloudImages[1].image.src = 'image/cloud2.png';

const groundImage = new Image();
groundImage.src = 'image/ground.png';

let bgX = 0;
let groundX = 0;

function updateBackground() {
    bgX -= gameSpeed;
    if (bgX <= -canvas.width) {
        bgX = 0;
    }
    ctx.drawImage(backgroundImage, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, bgX + canvas.width, 0, canvas.width, canvas.height);
}

function updateClouds() {
    cloudImages.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x <= -cloud.image.width) {
            cloud.x = canvas.width;
        }
        ctx.drawImage(cloud.image, cloud.x, cloud.y);
    });
}

function updateGround() {
    groundX -= gameSpeed;
    if (groundX <= -canvas.width) {
        groundX = 0;
    }
    ctx.drawImage(groundImage, groundX, canvas.height - groundImage.height, canvas.width, groundImage.height);
    ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - groundImage.height, canvas.width, groundImage.height);
}


function update() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateBackground();
        updateClouds();
        updateGround();

        dino.y += dino.velocityY;
        if (dino.y < canvas.height - dino.height) {
            dino.x += dino.speedBoost;
            dino.velocityY += dino.gravity;
        } else {
            dino.y = canvas.height - dino.height;
            dino.velocityY = 0;
            dino.jumps = 0;
            dino.x += (dino.speed + dino.speedBoost) - gameSpeed;
        }
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        if (dino.isChargingJump) {
            dino.jumpCharge += 2;
            if (dino.jumpCharge > dino.maxJumpCharge) {
                dino.jumpCharge = dino.maxJumpCharge;
            }
        }
        jumpBar.style.width = (dino.jumpCharge / dino.maxJumpCharge) * 100 + '%';

        if (tickSinceLastObstacle > nextObstacle) {
            const obstacleWidth = Math.random() * 50 + 20;
            const obstacleHeight = Math.random() * 50 + 20;
            const obstacleX = canvas.width;
            const obstacleY = canvas.height - obstacleHeight;

            obstacles.push({x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight});
            tickSinceLastObstacle = 0;
            nextObstacle = Math.floor(Math.random() * 200 + 20);
        }
        tickSinceLastObstacle++;

        if (tickSinceLastFood > nextFood && Math.random() < 0.07) {
            const bonusType = getRandomBonusType();
            bonuses.push({
                x: canvas.width,
                y: (canvas.height * 0.4) + Math.random() * (canvas.height * 0.5 - 30),
                width: 30,
                height: 30,
                type: bonusType
            });
            tickSinceLastFood = 0;
            nextFood = Math.floor(Math.random() * 250 + 50);
        }
        tickSinceLastFood++;

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
            } else {
                ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
            }
        }

        for (let i = bonuses.length - 1; i >= 0; i--) {
            bonuses[i].x -= gameSpeed;
            if (bonuses[i].x + bonuses[i].width < 0) {
                bonuses.splice(i, 1);
            } else {
                ctx.fillStyle = bonusData[bonuses[i].type].color;
                ctx.fillRect(bonuses[i].x, bonuses[i].y, bonuses[i].width, bonuses[i].height);
                ctx.fillStyle = 'black';
            }
        }

        if (dino.speedBoostDuration > 0) {
            dino.speedBoostDuration--;
            if (dino.speedBoostDuration === 0) {
                dino.speedBoost = 0;
            }
        }

        obstacles.forEach(obstacle => {
            if (dino.x < obstacle.x + obstacle.width &&
                dino.x + dino.width > obstacle.x &&
                dino.y < obstacle.y + obstacle.height &&
                dino.y + dino.height > obstacle.y) {
                dino.velocityY = -dino.jumpPower / 2;
                dino.jumps = 2;
                dino.speedBoost = -3;
                dino.speedBoostDuration = 20;
                obstacles.splice(0, 1);
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
                playSound(effect.sound);  // Play appropriate sound
            }
        });

        calories -= 0.04;
        if (calories > 80) {
            calorieBar.style.backgroundColor = 'red';
            dino.speed = 4.9;
        } else if (calories > 30) {
            calorieBar.style.backgroundColor = 'green';
            dino.speed = 5;
        } else {
            calorieBar.style.backgroundColor = 'yellow';
            dino.speed = 5;
        }
        if (calories <= 0 || dino.x < 20) {
            gameOver();
            return;
        }
        calorieBar.style.width = calories + '%';

        frame++;
    }
    requestAnimationFrame(update);
}

restartButton.addEventListener('click', resetGame);

returnToMenuButton.addEventListener('click', function () {
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

update();
