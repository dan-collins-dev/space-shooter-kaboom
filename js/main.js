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
loadSprite("laser", "./assets/sprites/laser.png");


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
        offset: 24,
    },
    
    
]);



const spawnLaser = (playerPos) => {
    add([
        sprite("laser"),
        scale(2),
        anchor("center"),
        pos(playerPos.x, playerPos.y - 25),
        area(),
        "projectile",
        {
            onCoolDown: false,
        },
        move(UP, 200),
    ])
}

onKeyDown("a", () => {
    if (player.pos.x <= player.offset) player.pos.x = player.offset
    else player.move(-player.speed, 0)
})

onKeyDown("d", () => {
    if (player.pos.x >= gameWidth - player.offset) player.pos.x = gameWidth - player.offset
    else player.move(player.speed, 0)
})

onKeyRelease("space", () => {
    if (!player.onCoolDown) {
        player.onCoolDown = true;
        spawnLaser(player.pos)
    } else {
        wait(0.25, () => player.onCoolDown = false)
    }
})