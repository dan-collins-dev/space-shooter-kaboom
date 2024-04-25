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
    loadSprite("cursor", "./assets/sprites/selectCursor.png");
    loadSprite("spaceIdle", "./assets/sprites/spacebar.png");
    loadSprite("spacePressed", "./assets/sprites/spacebarPressed.png")

    loadSprite("key", "./assets/sprites/btn-Sheet.png", {
        sliceX: 2,
        sliceY: 1,
    })

    loadSprite("spacebar", "./assets/sprites/spaceBtn-Sheet.png", {
        sliceX: 2,
        sliceY: 1
    })

    loadSprite("explosion", "./assets/sprites/explosion-Sheet.png", {
        sliceX: 9,
        sliceY: 1,
        anims: {
            explode: { from: 0, to: 8 },
        },
    });

    // Load Sounds
    loadSound("duck", "./assets/sounds/a-duck-walks-into-a-barn.ogg");
    loadSound("explosion", "./assets/sounds/explosion.wav");
    loadSound("shoot", "./assets/sounds/laserShoot.wav");
    loadSound("selectSound", "./assets/sounds/selectSound.wav");

    // Load font
    loadFont("PressStart2P", "./assets/fonts/PressStart2P-Regular.ttf");

    // const music = play("duck", {
    //     volume: 0.1,
    //     loop: true
    // })
};

export const toggleDebug = () => {
    if (debug.inspect === true) {
        debug.inspect = false;
    } else {
        debug.inspect = true;
    }
};
