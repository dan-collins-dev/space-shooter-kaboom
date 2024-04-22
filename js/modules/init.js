const gameWidth = 480;
const gameHeight = 640;

export const k = kaboom({
    width: gameWidth,
    height: gameHeight,
    font: "sans-serif",
    canvas: document.querySelector("#mycanvas"),
    background: [0, 0, 0],
    debug: true,
    crisp: true,
    // scale: 2
});

export const loadAssets = () => {
    // Load sprites
    loadSprite("playerShip", "./assets/sprites/playerShip.png");
    loadSprite("laser", "./assets/sprites/laser.png");
    loadSprite("enemyShip", "./assets/sprites/enemyShip.png");

    loadSprite("explosion", "./assets/sprites/explosion-Sheet.png", {
        sliceX: 9,
        sliceY: 1,
        anims: {
            explode: {from: 0, to: 8}
        }
    });
    
    // Load Sounds
    loadSound("duck", "./assets/sounds/a-duck-walks-into-a-barn.ogg");
    
    // Load font
    loadFont("PressStart2P", "./assets/fonts/PressStart2P-Regular.ttf");
}