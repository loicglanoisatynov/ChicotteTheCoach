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

// Exemple d'utilisation de cloneNode avec vérification
function playSound() {
    var soundElement = document.querySelector("#sound-element-id");
    
    if (soundElement) {
        var clonedSound = soundElement.cloneNode(true);
        document.body.appendChild(clonedSound);
        clonedSound.play();
    } else {
        console.error("Sound element not found!");
    }
}

// Fonction de mise à jour avec vérification de l'élément
function update() {
    var elements = document.querySelectorAll(".update-elements");

    elements.forEach(function(element) {
        if (element) {
            // Logique de mise à jour de l'élément
        }
    });
}
