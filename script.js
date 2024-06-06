var creditsButton = document.getElementById("menu-credits-button");

var creditsModal = document.getElementById("credits-modal");

var closeButton = document.getElementById("close-button");

const closeCreditsButton = document.getElementById("close-credits-button");

closeCreditsButton.addEventListener("click", function() {
    creditsModal.style.display = "none";
});

creditsButton.onclick = function() {
    creditsModal.style.display = "block";
}

closeButton.onclick = function() {
    creditsModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == creditsModal) {
        creditsModal.style.display = "none";
    }
}
