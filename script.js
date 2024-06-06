// Récupérer le bouton des crédits
var creditsButton = document.getElementById("menu-credits-button");

// Récupérer la fenêtre modale des crédits
var creditsModal = document.getElementById("credits-modal");

// Récupérer le bouton pour fermer la fenêtre modale
var closeButton = document.getElementById("close-button");

// Récupérez le bouton pour fermer les crédits
const closeCreditsButton = document.getElementById("close-credits-button");

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton pour fermer les crédits
closeCreditsButton.addEventListener("click", function() {
    // Cachez la fenêtre des crédits lorsque le bouton est cliqué
    creditsModal.style.display = "none";
});


creditsButton.onclick = function() {
    creditsModal.style.display = "block";
}

// Fonction pour fermer la fenêtre modale
closeButton.onclick = function() {
    creditsModal.style.display = "none";
}

// Fonction pour fermer la fenêtre modale si l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
    if (event.target == creditsModal) {
        creditsModal.style.display = "none";
    }
}
