document.addEventListener('DOMContentLoaded', function () {
    const foodIconsContainer = document.getElementById('food-icons-container');
    const foodImages = ['image/Menu/apple.png', 'image/Menu/boiledegg.png', 'image/Menu/lettuce.png', 'image/Menu/salad.png', 'image/Menu/banana.png', 'image/Menu/watermelon.png']; 

    function createFoodIcon() {
        const img = document.createElement('img');
        img.src = foodImages[Math.floor(Math.random() * foodImages.length)];
        img.classList.add('food-icon');
        img.style.top = Math.random() * 100 + 'vh';
        img.style.left = Math.random() * 100 + 'vw';
        // foodIconsContainer.appendChild(img);

        function moveFoodIcon() {
            img.style.top = Math.random() * 100 + 'vh';
            img.style.left = Math.random() * 100 + 'vw';
        }

        setInterval(moveFoodIcon, 2000);
    }

    for (let i = 0; i < 50; i++) {
        createFoodIcon();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var creditsButton = document.getElementById("menu-credits-button");
    var creditsModal = document.getElementById("credits-modal");
    var closeCredits = document.querySelector(".close");
    var closeCreditsButton = document.getElementById("close-credits-button");

    var rulesButton = document.getElementById("menu-rules-button");
    var rulesModal = document.getElementById("rules-modal");
    var closeRules = document.getElementById("close-rules");
    var closeRulesButton = document.getElementById("close-rules-button");

    var gif = document.getElementById("bottom-left-gif");
    var menuSound = document.getElementById("menu-sound");

    if (creditsButton) {
        creditsButton.onclick = function() {
            creditsModal.style.display = "block";
        }
    }

    if (closeCredits) {
        closeCredits.onclick = function() {
            creditsModal.style.display = "none";
        }
    }

    if (closeCreditsButton) {
        closeCreditsButton.addEventListener("click", function() {
            creditsModal.style.display = "none";
        });
    }

    if (rulesButton) {
        rulesButton.onclick = function() {
            rulesModal.style.display = "block";
        }
    }

    if (closeRules) {
        closeRules.onclick = function() {
            rulesModal.style.display = "none";
        }
    }

    if (closeRulesButton) {
        closeRulesButton.addEventListener("click", function() {
            rulesModal.style.display = "none";
        });
    }

    window.onclick = function(event) {
        if (event.target == creditsModal) {
            creditsModal.style.display = "none";
        } else if (event.target == rulesModal) {
            rulesModal.style.display = "none";
        }
    }

    if (gif && menuSound) {
        gif.addEventListener("click", function() {
            console.log("GIF clicked");
            menuSound.play();
        });
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