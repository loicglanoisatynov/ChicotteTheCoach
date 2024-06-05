

const groundImage = new Image();
groundImage.src = 'image/ground.png';

let groundX = 0;

function updateGround() {
    groundX -= gameSpeed;
    if (groundX <= -canvas.width) {
        groundX = 0;
    }
    ctx.drawImage(groundImage, groundX, canvas.height - groundImage.height, canvas.width, groundImage.height);
    ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - groundImage.height, canvas.width, groundImage.height);
}
