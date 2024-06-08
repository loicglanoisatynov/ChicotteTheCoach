1. [Description](#description)

Ceci est le rendu de travail du projet Hackaton par Loïc GLANOIS (B1-A), Brandon LUTULA (B1-B), Tibor LASSALLE (B1-A), Hamed KAFFA (B1-B) et Yassine SGHAIER (B1-B). Il s'agit d'un jeu de Run&Dash déployé par Live Server, jouable sur navigateur.

2. [Installation](#installation)

(Il est nécessaire d'avoir wsl, git, et python3 installés sur votre machine pour pouvoir installer le jeu)

Pour installer le jeu, les étapes à suivre sont les suivantes :

(Consignes à réaliser dans un terminal)
- Créez un dossier pour le jeu :
$ cd ~ && mkdir ChichotteTheCoach && cd ./ChichotteTheCoach
- Clonez le dépôt :
$ sudo git clone https://github.com/loicglanoisatynov/ChicotteTheCoach/.git
- Installez les dépendances :
$ sudo apt-get install npm && sudo apt-get install node && sudo apt-get install python3

3. [Usage](#usage)

Pour lancer le jeu, les étapes à suivre sont les suivantes :

- Depuis le dossier du jeu, lancez le serveur :
$ &>/dev/null python3 -m http.server 8080
- Ouvrez un navigateur web et entrez l'adresse suivante dans la barre de recherche :
http://localhost:8080/
(Si le jeu ne se lance pas, lancez VSCode, installez l'extension Live Server, ouvrez le dossier du jeu, puis cliquez sur `Go Live` en bas à droite de l'écran, puis allez sur votre navigateur et entrez localhost:5500 dans la barre de recherche)

Bon jeu !

4. [Credits](#credits)

Travail réalisé par Loïc GLANOIS, B1A-INFO, Brandon LUTULA (B1-B), Tibor LASSALLE (B1-A), Hamed KAFFA (B1-B) et Yassine SGHAIER (B1-B). Adresse mail : loic.glanois@ynov.com

Thème choisi par l'école, projet choisi par l'aquipe.