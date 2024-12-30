// Création de l'application PixiJS avec une taille de 800x400
const app = new PIXI.Application();
await app.init({ width: 800, height: 400 });

// Ajout du canvas à la page HTML
document.body.appendChild(app.canvas);

// Classe Raquette (positions, mouvements (haut/bas) et dimensions (15x35px))
class Raquette extends PIXI.Graphics {
    constructor(x, y) {
        super(); // Appel du super constructeur

        this.beginFill(0xFF00);
        this.drawRect(0, 0, 15, 35);
        this.endFill();

        // Position initiale de la raquette
        this.x = x;
        this.y = y;
        
        // Vitesse de déplacement
        this.vitesse = 5;
        
        // Initialisation des touches de déplacement
        this.upPressed = false;
        this.downPressed = false;

        // Ajouter la raquette à la scène
        app.stage.addChild(this);

        console.log(this);
    }

    // Fonction pour gérer le déplacement
    deplacer() {
        if (this.upPressed && this.y > 0) {
            this.y -= this.vitesse;
        }
        if (this.downPressed && this.y < app.screen.height - 35) {
            this.y += this.vitesse;
        }
    }
}

// Classe Balle (position, vitesse, direction et détection de collision avec raquettes/terrain)
class Balle extends PIXI.Graphics {
    constructor(x, y) {
        super();

        // Dessiner la balle (cercle)
        this.beginFill(0xFF0000);
        this.drawCircle(0, 0, 10);
        this.endFill();

        // Position initiale de la balle
        this.x = x;
        this.y = y;

        // Ajouter la balle à la scène
        app.stage.addChild(this);

        // Vitesse de la balle (direction initiale aléatoire)
        this.vx = (Math.random() < 0.5 ? 1 : -1) * 5;
        this.vy = (Math.random() < 0.5 ? 1 : -1) * 5;
    }

    // Fonction pour gérer le déplacement
    deplacer(raquetteGauche, raquetteDroite) {
        this.x += this.vx;
        this.y += this.vy;

        // Gestion rebonds Mur
        if (this.y <= 0 || this.y >= app.screen.height) {
            this.vy *= -1;
        }

        // Gestion rebonds Raquette
        if (this.x -10 <= raquetteGauche.x +15 && this.y >= raquetteGauche.y && this.y <= raquetteGauche.y + 35) {
            this.vx *= -1;  // Inverser la direction horizontale
        }
        
        if (this.x + 10 >= raquetteDroite.x && this.y >= raquetteDroite.y && this.y <= raquetteDroite.y + 35) {
            this.vx *= -1;  // Inverser la direction horizontale
        }

    }
}

// Classe Jeu (Gère le terrain, les objets, les collisions et la boucle de jeu)
class Jeu {
    constructor() {
        // Création des deux raquettes
        this.raquetteGauche = new Raquette(30, app.screen.height / 2 - 17.5); // À gauche
        this.raquetteDroite = new Raquette(app.screen.width - 45, app.screen.height / 2 - 17.5); // À droite
        // Création de la balle au centre de l'écran
        this.balle = new Balle(app.screen.width / 2, app.screen.height / 2);

        // Lancement de la boucle de jeu
        app.ticker.add(() => this.loop());
    }

    // Boucle de jeu pour mettre à jour les éléments à chaque frame
    loop() {
        this.raquetteGauche.deplacer();
        this.raquetteDroite.deplacer();
        this.balle.deplacer(this.raquetteGauche, this.raquetteDroite);
    }
}

// Gestion des événements clavier
window.addEventListener("keydown", (e) => {
    // Z pour la raquette de gauche vers le haut, S vers le bas
    if (e.key === "z") jeu.raquetteGauche.upPressed = true;
    if (e.key === "s") jeu.raquetteGauche.downPressed = true;

    // Flèche haut pour la raquette de droite vers le haut, Flèche bas vers le bas
    if (e.key === "ArrowUp") jeu.raquetteDroite.upPressed = true;
    if (e.key === "ArrowDown") jeu.raquetteDroite.downPressed = true;
});

window.addEventListener("keyup", (e) => {
    // Arrêt des mouvements
    if (e.key === "z") jeu.raquetteGauche.upPressed = false;
    if (e.key === "s") jeu.raquetteGauche.downPressed = false;
    if (e.key === "ArrowUp") jeu.raquetteDroite.upPressed = false;
    if (e.key === "ArrowDown") jeu.raquetteDroite.downPressed = false;
});

// Démarrer le jeu
const jeu = new Jeu();