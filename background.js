const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundGif = new Image();
backgroundGif.src = 'image/A3R.gif';

const cloudImages = [
    { image: new Image(), x: canvas.width, y: 50, speed: 2 },
    { image: new Image(), x: canvas.width * 1.5, y: 150, speed: 1.5 },
];

cloudImages[0].image.src = 'image/img.png';
cloudImages[1].image.src = 'image/img.png';

let bgX = 0;

function updateBackground() {
    bgX -= gameSpeed;
    if (bgX <= -canvas.width) {
        bgX = 0;
    }
    ctx.drawImage(backgroundGif, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundGif, bgX + canvas.width, 0, canvas.width, canvas.height);
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
