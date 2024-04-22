const gameWidth = 480;
const gameHeight = 640;
let score = 0;
let enemySpawnDelay = 3;
let fireDelay = 0.25;
let dmgShakeFactor = 25;
let isAlive = true;

// Initialize Kaboom context
kaboom({
    width: gameWidth,
    height: gameHeight,
    font: "sans-serif",
    canvas: document.querySelector("#mycanvas"),
    background: [0, 0, 0],
    debug: true,
    crisp: true,
    // scale: 2
});

// Loading the sprites
// NOTE: Down the line look into how to importing asesprite files work
loadSprite("playerShip", "./assets/sprites/playerShip.png");
loadSprite("laser", "./assets/sprites/laser.png");
loadSprite("enemyShip", "./assets/sprites/enemyShip.png");

// Load Sounds
loadSound("duck", "./assets/sounds/a-duck-walks-into-a-barn.ogg");

// Load font
loadFont("PressStart2P", "./assets/fonts/PressStart2P-Regular.ttf");

// Main Menu Scene
let mainMenu = scene("MainMenu", () => {
    const titleMsg = add([
        text("TEST", {
            size: 32,
            font: "PressStart2P",
        }),
        anchor("center"),
        pos(center().x, 160),
    ]);

    onKeyDown("enter", () => {
        go("Game");
    });
});

// debug.inspect = true
// volume(.01)

// Main Gameplay Scene
let gameplay = scene("Game", () => {
    // play("duck", {loop: true});
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
        health(3),
    ]);

    const spawnLaser = (playerPos) => {
        let laser = add([
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
            fixed(),
            offscreen({destroy: true})
        ]);

        laser.onCollide("enemy", (enemy) => {
            enemy.alive = false
            destroy(enemy);
            score += 1;
            console.log(score);
            destroy(laser);
        });
    };

    const spawnEnemy = () => {
        loop(enemySpawnDelay, () => {
            let e = add([
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
                    alive: true
                },
                offscreen({destroy: true}),
                move(DOWN, randi(100, 150)),
                fixed(),
            ]);

            e.onDestroy(() => {
                if (e.alive) score -= 1
            })
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
        if (!player.onCoolDown && isAlive) {
            player.onCoolDown = true;
            spawnLaser(player.pos);
        } else {
            wait(fireDelay, () => (player.onCoolDown = false));
        }
    });

    player.onCollide("enemy", (e) => {
        shake(dmgShakeFactor);
        player.hurt(1);
    });

    player.on("hurt", () => {
        console.log("OUCH");
    });

    player.on("death", () => {
        isAlive = false;
        destroy(player);
    });

    spawnEnemy();

    toggleDebug = () => {
        if (debug.inspect === true) {
            debug.inspect = false;
        } else {
            debug.inspect = true;
        }
    };
    onKeyRelease("1", toggleDebug);
});

go("MainMenu");
