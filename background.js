
const backgroundImage = new Image();
backgroundImage.src = 'image/city_background.png';

const cloudImages = [
    { image: new Image(), x: canvas.width, y: 50, speed: 2 },
    { image: new Image(), x: canvas.width * 1.5, y: 150, speed: 1.5 },
];

cloudImages[0].image.src = 'image/cloud1.png';
cloudImages[1].image.src = 'image/cloud2.png';

let bgX = 0;

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
