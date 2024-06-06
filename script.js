document.addEventListener('DOMContentLoaded', function() {
    var creditsButton = document.getElementById("menu-credits-button");
    var creditsModal = document.getElementById("credits-modal");
    var closeButton = document.getElementById("close-button");
    const closeCreditsButton = document.getElementById("close-credits-button");

    if (creditsButton) {
        creditsButton.onclick = function() {
            creditsModal.style.display = "block";
        }
    }

    if (closeButton) {
        closeButton.onclick = function() {
            creditsModal.style.display = "none";
        }
    }

    if (closeCreditsButton) {
        closeCreditsButton.addEventListener("click", function() {
            creditsModal.style.display = "none";
        });
    }

    window.onclick = function(event) {
        if (event.target == creditsModal) {
            creditsModal.style.display = "none";
        }
    }
});
