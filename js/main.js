const gameWidth = 480;
const gameHeight = 640;
let score = 0;
let enemySpawnDelay = 3;
let fireDelay = 0.25;
let dmgShakeFactor = 25;

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
        text("Infinity Shot", {
            size: 8,
            font: "PressStart2P",
        }),
        anchor("center"),
        pos(center().x, 160),
        timer(),
        rotate(0),
        state("zoom", ["zoom", "rotate"])        
    ]);

    // titleMsg.onStateEnter("zoom", async () => {
    //     await tween(
    //         titleMsg.textSize,
        // 32,
        // 1,
        // (currentSize) => titleMsg.textSize = currentSize,
        // easings.linear
    //     )
    // })
    
    titleMsg.tween(
        titleMsg.textSize,
        32,
        1,
        (currentSize) => titleMsg.textSize = currentSize,
        easings.linear
    )

    titleMsg.tween(
        titleMsg.angle,
        360,
        1,
        (currentAngle) => titleMsg.angle = currentAngle,
        easings.linear
    )

    onKeyDown("enter", () => {
        score = 0;
        go("Game");
    });
});


// Main Gameplay Scene
let gameplay = scene("Game", () => {
    let enemyMinSpeed = 75;
    let enemyMaxSpeed = 100;



    const enemySpeedTimer = add([
        timer(),
    ])

    enemySpeedTimer.loop(60, () => {
        enemyMinSpeed += 25
        enemyMaxSpeed += 50
    })

    const scoreBG = add([
        pos(center().x, 16), 
        rect(width(), 32), 
        outline(4), 
        area(),
        color(0, 0, 0),
        anchor("center"),
        z(1),
        fixed(),
        "scoreLabel"
    ]);

    const scoreLabel = add([
        text(`Score: ${score}`, {
            size: 16,
            font: "PressStart2P",
        }),
        anchor("center"),
        pos(center().x, 16),
        z(1),
        fixed(),
        timer(),
        "score",
        state("idle", ["idle","expand","shrink"])
    ]);

    scoreLabel.onStateEnter("expand", async () => {
        await tween(
            scoreLabel.textSize,
            24,
            0.125,
            (currentSize) => scoreLabel.textSize = currentSize,
            easings.easeInCubic
        )
        scoreLabel.enterState("idle");
    })

    scoreLabel.onStateEnter("idle", async () => {
        await tween(
            scoreLabel.textSize,
            16,
            0.5,
            (currentSize) => scoreLabel.textSize = currentSize,
            easings.easeInCubic
        )
    })

    scoreLabel.onStateEnter("shrink", async () => {
        await tween(
            scoreLabel.textSize,
            8,
            0.125,
            (currentSize) => scoreLabel.textSize = currentSize,
            easings.easeInCubic
        )
        scoreLabel.enterState("idle");
    })

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
            alive: true
        },
        health(3),
        timer(),
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
            offscreen({ destroy: true }),
        ]);

        laser.onCollide("enemy", (enemy) => {
            enemy.alive = false;
            destroy(enemy);
            scoreLabel.trigger("scoreUp")
            destroy(laser);
        });
    };

    const spawnEnemy = () => {
        loop(enemySpawnDelay, () => {
            let e = add([
                sprite("enemyShip"),
                scale(3),
                anchor("center"),
                pos(randi(24, gameWidth - 24), 0),
                area(),
                body(),
                "enemy",
                {
                    speed: 240,
                    offset: 24,
                    alive: true,
                },
                offscreen({ destroy: true }),
                move(DOWN, randi(enemyMinSpeed, enemyMaxSpeed)),
                fixed(),
            ]);

            e.onDestroy(() => {
                if (e.alive && player.alive) {
                    scoreLabel.trigger("scoreDown")
                }
            });
        });
    };

    scoreLabel.on("scoreUp", () => {
        score += 1;
        scoreLabel.text = `Score: ${score}`;
        scoreLabel.enterState("expand")
    })

    scoreLabel.on("scoreDown", () => {
        score -= 1;
        scoreLabel.text = `Score: ${score}`;
        scoreLabel.enterState("shrink");
    })

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
        if (!player.onCoolDown && player.alive) {
            player.onCoolDown = true;
            spawnLaser(player.pos);
        } else {
            player.wait(fireDelay, () => (player.onCoolDown = false));
        }
    });

    player.onCollide("enemy", (e) => {
        destroy(e);
        shake(dmgShakeFactor);
        player.hurt(1);
    });

    player.on("death", () => {
        player.alive = false;
        destroy(player);
        go("MainMenu")
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
