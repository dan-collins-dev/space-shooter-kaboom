const gameWidth = 480;
const gameHeight = 640;

// Initialize Kaboom context
kaboom({
    width: gameWidth,
    height: gameHeight,
    font: "sans-serif",
    canvas: document.querySelector("#mycanvas"),
    background: [0, 0, 0],
    debug: true,
});

// Loading the player sprite
loadSprite("playerShip", "./assets/sprites/playerShip.png");

const player = add([
    sprite("playerShip"),
    scale(3),
    anchor("center"),
    pos(center().x, gameHeight - 40),
    area(),
    body(),
    "player",
    {
        speed: 240,
        offset: 24
    }
]);

onKeyDown("a", () => {
    if (player.pos.x <= player.offset) player.pos.x = player.offset
    else player.move(-player.speed, 0)
})

onKeyDown("d", () => {
    if (player.pos.x >= gameWidth - player.offset) player.pos.x = gameWidth - player.offset
    else player.move(player.speed, 0)
})