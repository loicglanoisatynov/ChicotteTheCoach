const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const obstacles = [];
const bonuses = [];
let frame = 0;
let calories = 80;
let score = 0;
let gameRunning = false;
let tickSinceLastObstacle = 0;
let nextObstacle = 0;
let tickSinceLastFood = 0;
let nextFood = 0;
let gameSpeed = 3;
let skin = 0;
let totalSkins = 8;
let speedCap = new Map();

const dino = {
    x: canvas.width / 3 - 100,
    y: canvas.height - 20 - 100,
    width: 30,
    height: 30,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: 15,
    jumps: 0,
    maxJumps: 2,
    isChargingJump: false,
    jumpCharge: 0,
    maxJumpCharge: 100,
    chargeJumpPower: 30,
    speed: gameSpeed,
    speedBoost: 0,
    speedBoostDuration: 0,
    skin: 'runner1.gif',
    skinNb: 1
};

const calorieBar = document.getElementById('calorie-bar');
const jumpBar = document.getElementById('jump-bar');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const scoreboardContainer = document.getElementById('scoreboard');
const usernameInput = document.getElementById('username');
const dinoDiv = document.getElementById('dino');
const dinoSkin = document.getElementById('dinoSkin');
const coachDiv = document.getElementById('coach');
const coachSkin = document.getElementById('coachSkin');



const gameOverContainer = document.getElementById('game-over-container');
const gameContainer = document.getElementById('game-container');
const inputContainer = document.getElementById('input-container');
const shopContainer = document.getElementById('shop-container');

const restartButton = document.getElementById('restart-button');
const returnToMenuButton = document.getElementById('return-to-menu-button');
const shopButton = document.getElementById('menu-shop-button');
const startButton = document.getElementById('start-button');
const menuOptionsButton = document.getElementById('menu-options-button');
const optionsButton = document.getElementById('options-button');

const foodSound = document.getElementById('food-sound');
const jumpSound = document.getElementById('jump-sound');
const buffSound = document.getElementById('buff-sound');
const debuffSound = document.getElementById('debuff-sound');
const hitSound = document.getElementById('hit-sound');

const mainMenu = document.getElementById('main-menu');

var jumpKeyBind = ' ';
var chargeKeyBind = 'Shift';

dinoDiv.style.position = 'absolute';

const bonusTypes = {
    BOOST: 'BOOST',
    FAT: 'FAT',
    FIT: 'FIT'
};

const bonusData = {
    BOOST: { calories: 0, speedBoost: 2, duration: 100, color: 'blue', sound: buffSound },
    FAT: { calories: 40, speedBoost: -1, duration: 50, color: 'brown', sound: debuffSound },
    FIT: { calories: 20, speedBoost: 1, duration: 50, color: 'green', sound: buffSound }
};

const bonusItems = {
    BOOST: ['image/Menu/energydrink.png'],
    FAT: ['image/Menu/burger.png', 'image/Menu/donut.png'],
    FIT: ['image/Menu/apple.png', 'image/Menu/banana.png', 'image/Menu/watermelon.png', 'image/Menu/boiledegg.png', 'image/Menu/salad.png', 'image/Menu/carrot.png']
};

var jumpKeyBind = ' ';
var chargeKeyBind = 'Shift';

// Background related variables and functions
const backgroundGif = new Image();
backgroundGif.src = 'image/A3R.gif';

const road = new Image();
road.src = 'assets/road/road.png';
let roadX = 0;

const cloudImages = [
    { image: new Image(), x: canvas.width, y: 30, speed: 2 },
    { image: new Image(), x: canvas.width * 1.5, y: 80, speed: 1.5 },
];

cloudImages[0].image.src = 'image/img.png';
cloudImages[1].image.src = 'image/img.png';

const obstacleImages = [
    'image/img_1.png',
    'assets/obstacles/city/bench2.png',
    'assets/obstacles/city/cone.png',
    'assets/obstacles/city/mailbox.png',
    'assets/obstacles/city/tire.png'
];
const obstacleImageObjects = obstacleImages.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

let bgX = 0;

function updateBackground() {
    bgX -= gameSpeed;
    if (bgX <= -canvas.width) {
        bgX = 0;
    }
    ctx.drawImage(backgroundGif, bgX, 0, canvas.width, canvas.height - 100);
    ctx.drawImage(backgroundGif, bgX + canvas.width, 0, canvas.width, canvas.height - 100);
}

function updateClouds() {
    cloudImages.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x <= -cloud.image.width * 0.5) {
            cloud.x = canvas.width;
        }
        ctx.drawImage(cloud.image, cloud.x, cloud.y, cloud.image.width * 0.5, cloud.image.height * 0.5);
    });
}

function updateRoad() {

    roadX -= gameSpeed;
    if (roadX <= -canvas.width) {
        roadX = 0;
    }
    ctx.drawImage(road, roadX, canvas.height - 100, canvas.width, 100);
    ctx.drawImage(road, roadX + canvas.width, canvas.height - 100, canvas.width, 100);
}

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

shopButton.addEventListener('click', function(e) {
    e.preventDefault();
    mainMenu.classList.add('hidden');
    shopContainer.classList.remove('hidden');
});

function returnMain() {
    inputContainer.classList.add('hidden');
    shopContainer.classList.add('hidden');
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
};

optionsButton.addEventListener('click', function (e) {
    e.preventDefault();
    inputContainer.classList.toggle('hidden');
    gameRunning = !gameRunning;
});

menuOptionsButton.addEventListener('click', function(e) {
    e.preventDefault();
    mainMenu.classList.add('hidden');
    inputContainer.classList.remove('hidden');
});

startButton.addEventListener('click', function(e) {
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
    // if (!gameRunning && event.key === 'Enter') {
    //     resetGame();
    // }

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
        if (dino.isChargingJump && dino.jumps < dino.maxJumps) {
            dino.velocityY = -dino.chargeJumpPower * (dino.jumpCharge / dino.maxJumpCharge);
            dino.jumps++;
            dino.isChargingJump = false;
            dino.jumpCharge = 0;
            playSound(jumpSound);
        }
    }
});

function resetGame() {
    gameSpeed = 3;
    dino.x = canvas.width / 3 - 15 - 100;
    dino.y = canvas.height - dino.height - 90;
    dino.velocityY = 0;
    dino.jumps = 0;
    dino.isChargingJump = false;
    dino.speed = gameSpeed;
    dino.speedBoost = 0;
    dino.speedBoostDuration = 0;
    obstacles.length = 0;
    bonuses.length = 0;
    gameOverContainer.classList.add('hidden');
    scoreDisplay.textContent = 'Score: 0';
    // gameRunning = true;
    calories = 80;
    score = 0;
    tickSinceLastObstacle = 0;
    nextObstacle = Math.floor(Math.random() * 200 + 20);
    tickSinceLastFood = 0;
    nextFood = Math.floor(Math.random() * 250 + 50);
    dinoSkin.style.rotate=0+'deg';

    enterToStart();
    update();
}

function gameOver() {
    const username = usernameInput.value || 'Anonyme';

    coachSkin.src = 'assets/sprites/coach/game_over/game_over_whip/game_over.gif';
    
    updateScoreboard(username, score);
    finalScore.textContent = 'Score: ' + score;
    gameOverContainer.classList.remove('hidden');
    dinoSkin.style.rotate = -90 + 'deg';
    dinoDiv.style.top = canvas.height - 150 + 'px';
    dinoDiv.style.left = 30*2 + 'px';
    
    dinoSkin.style.animationPlayState = 'paused';
    gameRunning = false;
}

function buySkin(skin) {
    if (parseInt(getCookies('points')) >= 100) {
        document.cookie = "points=" + (parseInt(getCookies('points')) - 100);
        document.getElementById('pointcounter').textContent = "Coins : " + getCookies('points');
        changeSkin(skin);
        document.getElementById('select'+String(skin)).removeEventListener('click', buySkin.bind(null, skin));
        document.getElementById('select'+String(skin)).addEventListener('click', changeSkin.bind(null, skin));
    }
}

function changeSkin(skin) {
    dino.skin = 'runners/runner'+String(skin)+'.gif';
    document.getElementById('select'+String(dino.skinNb)).textContent = 'Select';
    document.getElementById('select'+String(dino.skinNb)).disabled = false;
    document.getElementById('select'+String(skin)).textContent = 'Selected';
    document.getElementById('select'+String(skin)).disabled = true;
    console.log('select'+String(skin));
    
    dino.skinNb = skin;
   dinoSkin.src = dino.skin;
}

function createShopItems() {
    let shop = document.getElementById('shop-items');
    let price = 0;

    for (var i = 0; i < totalSkins; i++) {
        var div = document.createElement('div');
        div.className = 'shop-item';

        var img = document.createElement('img');
        img.id = 'runner' + (i + 1) + 'gif';
        img.src = 'runners/runner' + (i + 1) + '.gif';
        img.alt = 'runner' + (i + 1);
        div.appendChild(img);

        var p = document.createElement('p');
        p.textContent = 'Runner ' + (i + 1);
        div.appendChild(p);

        var button = document.createElement('button');
        button.id = 'select' + (i + 1);
        button.className = 'select-button';
        button.textContent = 'Buy ' + 100;
        button.addEventListener('click', buySkin.bind(null, i + 1));
        div.appendChild(button);

        shop.appendChild(div);
    }
    document.getElementById('select1').textContent = 'Selected';
    document.getElementById('select1').disabled = true;
    document.getElementById('select1').removeEventListener('click', buySkin.bind(null, 1));
    document.getElementById('select1').addEventListener('click', changeSkin.bind(null, 1));
}

function updateScoreboard(username, score) {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
    scoreboard.push({ username, score });
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
    var type = bonusTypes[types[Math.floor(Math.random() * types.length)]];
    return type;
}

function getRandomBonusItem(type) {
    return bonusItems[type][Math.floor(Math.random() * bonusItems[type].length)];
}

function getCookies(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
}

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
};

function update() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettez à jour l'arrière-plan et les nuages
        updateBackground();
        updateClouds();
        updateScoreboard();
        updateRoad();

        dino.y += dino.velocityY;
        if (dino.y < canvas.height - dino.height - 90) {
            dino.x += dino.speedBoost;
            dino.velocityY += dino.gravity;
        } else {
            dino.y = canvas.height - dino.height - 90;
            dino.velocityY = 0;
            dino.jumps = 0;
            dino.x += (dino.speed + dino.speedBoost) - gameSpeed;
            if (dino.x > canvas.width) {
                dino.x = canvas.width;
            }
        }
        ctx.color = 'black';
        // ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        dinoDiv.style.left = (dino.x - 50) + 'px';
        dinoDiv.style.top = (dino.y - 35) + 'px';

        if (dino.isChargingJump) {
            dino.jumpCharge += 2;
            if (dino.jumpCharge > dino.maxJumpCharge) {
                dino.jumpCharge = dino.maxJumpCharge;
            }
        }
        jumpBar.style.width = (dino.jumpCharge / dino.maxJumpCharge) * 100 + '%';

        if (tickSinceLastObstacle > nextObstacle && Math.random() < 0.1){
            const obstacleImage = obstacleImageObjects[Math.floor(Math.random() * obstacleImageObjects.length)];
            let obstacleWidth = 50;
            let obstacleHeight = obstacleWidth / 2;
            const obstacleX = canvas.width;
            let obstacleY = canvas.height - obstacleHeight-100;

            if ((obstacleImage.src).includes('bench')) {
                obstacleWidth = 98;
                obstacleHeight = 58;
                obstacleY = canvas.height - obstacleHeight - 90;
            } else if ((obstacleImage.src).includes('mail')) {
                obstacleWidth = 40;
                obstacleHeight = 66;
                obstacleY = canvas.height - obstacleHeight - 90;
            } else if ((obstacleImage.src).includes('cone')) {
                obstacleWidth = 46;
                obstacleHeight = 54;
                obstacleY = canvas.height - obstacleHeight - 90;
            } else if ((obstacleImage.src).includes('tire')) {
                obstacleWidth = 53;
                obstacleHeight = 36;
                obstacleY = canvas.height - obstacleHeight - 90;
            }

            obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight, image: obstacleImage });
            tickSinceLastObstacle = 0;
            nextObstacle = Math.floor(Math.random() * 200 + 100);
        }
        tickSinceLastObstacle++;

        if (tickSinceLastFood > nextFood && Math.random() < 0.07) {
            const bonusType= getRandomBonusType();
            const path = getRandomBonusItem(bonusType);
            bonuses.push({
                x: canvas.width,
                y: (canvas.height * 0.4) + Math.random() * (canvas.height * 0.5 - 75)-100,
                width: 75,
                height: 75,
                type: bonusType,
                path: path
            });
            console.log('Creating bonus', bonusType, path)
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
                ctx.drawImage(obstacles[i].image, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
            }
        }

        for (let i = bonuses.length - 1; i >= 0; i--) {
            bonuses[i].x -= gameSpeed;
            if (bonuses[i].x + bonuses[i].width < 0) {
                bonuses.splice(i, 1);
            } else {
                var img = new Image();
                img.src = bonuses[i].path;
                ctx.drawImage(img, bonuses[i].x, bonuses[i].y, bonuses[i].width, bonuses[i].height);
            }
        }

        if (dino.speedBoostDuration > 0) {
            dino.speedBoostDuration--;
            if (dino.speedBoostDuration === 0) {
                dino.speedBoost = 0;
            }
        }

        obstacles.forEach((obstacle, index) => {
            if (dino.x + dino.width - 30 > obstacle.x &&
                dino.y + dino.height > obstacle.y &&
                dino.x < obstacle.x + obstacle.width &&
                dino.y < obstacle.y + obstacle.height) {
                obstacles.splice(index, 1); // Remove the obstacle from the array

                dino.velocityY = -dino.jumpPower / 2;
                dino.jumps = 2;
                dino.speedBoost = -3;
                dino.speedBoostDuration = 20;

                dinoDiv.classList.toggle('hit');
                setTimeout(() => {
                    dinoDiv.classList.remove('hit');
                }, 300);

                playSound(hitSound);
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

        if (score % 10 === 0 && score > 0 && !speedCap.has(score) && gameSpeed < 6) {
            gameSpeed += 0.1;
            speedCap.set(score, true);
        }

        calories -= 0.04;
        if (calories > 80) {
            calorieBar.style.backgroundColor = 'red';
            dino.speed = gameSpeed - 0.1;
        } else if (calories > 30) {
            calorieBar.style.backgroundColor = 'green';
            dino.speed = gameSpeed;
        } else {
            calorieBar.style.backgroundColor = 'yellow';
            dino.speed = gameSpeed;
        }
        if (calories <= 0 || dino.x < 100) {
            document.cookie = "points=" + (parseInt(getCookies('points')) + score);
            gameOver();
            document.getElementById('pointcounter').textContent = "Coins : " + getCookies('points');
            return;
        }
        calorieBar.style.width = calories + '%';

        frame++;
    }
    wait(1)
    requestAnimationFrame(update);
}

restartButton.addEventListener('click', resetGame);
document.cookie = "points=0";
createShopItems();
// update();

function enterToStart() {
    updateBackground();
    updateClouds();
    updateRoad();


    let k = 1;
    coachSkin.src = 'assets/sprites/coach/standing.gif';
    let replique1 = 'Je te prends encore en train de manger des cochonneries ?';
    let replique2 = 'Tu vas gâcher tout ton entraînement ! Attends un peu que je t\'attrape !';

    // Freezes the player's movement and gif animation
    // gameRunning = false;
    dinoSkin.style.animationPlayState = 'paused';


    // Créer une bulle de dialogue au-dessus du coach
    const bubble = document.createElement('div');
    const bubbleArrow = document.createElement('div');
    bubble.id = 'coach-speech-bubble';
    bubble.className = 'speech-bubble';
    bubble.textContent = replique1;
    bubble.style.position = 'absolute';
    bubble.style.top = -40 + 'px';
    bubble.style.left = coachDiv.offsetLeft + 50 + 'px';
    bubbleArrow.className = 'speech-bubble-arrow';
    dino.x = canvas.width / 3 - 15 - 50;
    dino.y = canvas.height - 30 - 90;
    dinoDiv.style.left = (dino.x - 50) + 'px';
    dinoDiv.style.top = (dino.y - 35) + 'px';

    bubble.appendChild(bubbleArrow);
    
    coachDiv.appendChild(bubble);


    document.addEventListener('keydown', function (event) {
        if (k === 1) {
            // Retourner l'image du Dino sur son axe Y (le faire regarder vers la gauche)
            dinoSkin.style.transform = 'scaleX(-1)';
            k++;
            // Effacer la bulle de dialogue du coach
            bubbleArrow.style.display = 'none';
            bubble.style.display = 'none';
        } else if (k === 2) {
            // Remettre la bulle de dialogue du coach
            bubble.textContent = replique2;
            bubbleArrow.style.display = 'block';
            bubble.style.display = 'block';
            k++;
            
        } else if ((k === 3)) {
            coachSkin.src = 'assets/sprites/whipandcoach/chicotte.gif';
            dinoSkin.style.transform = 'scaleX(1)';
            bubble.style.display = 'none';

            gameRunning = true;
            k = 0;
            update();
        }
    });

    // gameRunning = true;
}

