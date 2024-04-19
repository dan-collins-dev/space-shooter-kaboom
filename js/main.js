const gameWidth = 480;
const gameHeight = 640;
let score = 0;
let enemySpawnDelay = 3;
let fireDelay = 0.25

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
loadSprite("enemyShip", "./assets/sprites/enemyShip.png");

const player = add([
    sprite("playerShip"),
    scale(3),
    anchor("center"),
    pos(center().x, gameHeight - 40),
    area(),
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
    ]);
};

const spawnEnemy = () => {
    loop(enemySpawnDelay, () => {
        console.log("Creating enemy");
        add([
            sprite("enemyShip"),
            scale(3),
            anchor("center"),
            pos(randi(24, gameWidth - 24), -200),
            area(),
            body(),
            "enemy",
            {
                speed: 240,
                offset: 24,
            },
            move(DOWN, randi(100, 150)),
            fixed(),
        ]);
    });
};

onKeyDown("a", () => {
    if (player.pos.x <= player.offset) player.pos.x = player.offset;
    else player.move(-player.speed, 0);
});

onKeyDown("d", () => {
    if (player.pos.x >= gameWidth - player.offset)
        player.pos.x = gameWidth - player.offset;
    else player.move(player.speed, 0);
});

onKeyRelease("space", () => {
    if (!player.onCoolDown) {
        player.onCoolDown = true;
        spawnLaser(player.pos);
    } else {
        wait(fireDelay, () => (player.onCoolDown = false));
    }
});

player.onCollide("enemy", (e) => {
    shake(50);
})

spawnEnemy();