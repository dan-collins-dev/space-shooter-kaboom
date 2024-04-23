import { k, loadAssets } from "./modules/init.js"
import { createPlayer } from "./modules/player.js";
import { createEnemy, increaseEnemySpeed, resetEnemySpeed } from "./modules/enemy.js";
import { createExplosion } from "./modules/explosion.js";


loadAssets()

let score = 0;
let enemySpawnDelay = 3;
let fireDelay = 0.01;

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

    const optionSelect = add([
        pos(center().x, center().y),
        anchor("center"),
    ])

    
    optionSelect.add([
        text("Start Game", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(0, 0),
        anchor("center")
    ])

    // optionSelect.add([
    //     text("Test"),
    //     anchor("center")
    // ])
    
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

    // onSceneLeave(() => {
    //     const allObjs = get("*", { recursive: true })
    //     for (const obj of allObjs) {
    //         destroy(obj);
    //     }
    // })
});


// Main Gameplay Scene
let gameplay = scene("Game", () => {
    const player = createPlayer()

    const enemySpeedTimer = add([
        timer(),
    ])

    enemySpeedTimer.loop(5, () => {
        increaseEnemySpeed();
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

    scoreLabel.on("scoreUp", () => {
        score += 1;
        scoreLabel.text = `Score: ${score}`;
        scoreLabel.enterState("expand")
    })

    scoreLabel.on("scoreDown", () => {
        score -= 1;
        if (score < 0) {
            resetEnemySpeed()
            go("MainMenu")
        } 
        scoreLabel.text = `Score: ${score}`;
        scoreLabel.enterState("shrink");
    })

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
            createExplosion(enemy.pos)
            destroy(enemy);
            scoreLabel.trigger("scoreUp")
            destroy(laser);
        });
    };

    const spawnEnemy = () => {
        loop(enemySpawnDelay, () => {
            const e = createEnemy()
        });
    };

    

    onKeyDown("a", () => {
        if (player.pos.x <= player.offset) player.pos.x = player.offset;
        else player.move(-player.speed, 0);
    });

    onKeyDown("d", () => {
        if (player.pos.x >= width() - player.offset)
            player.pos.x = width() - player.offset;
        else player.move(player.speed, 0);
    });

    onKeyRelease("space", () => {
        if (!player.onCoolDown && player.alive) {
            player.onCoolDown = true;
            spawnLaser(player.pos);
            play("shoot", {volume: 0.1})
        } else {
            player.wait(fireDelay, () => (player.onCoolDown = false));
        }
    });


    /* Come back to when implementing pausing? */
    // onKeyRelease("p", () => {
    //     let all = get("projectile")
    //     for (const thing of all) {
    //         thing.paused = true;
    //     }
    //     // player.paused = true;
    //     console.log("PAUSING?")
    // })

    spawnEnemy();

    const toggleDebug = () => {
        if (debug.inspect === true) {
            debug.inspect = false;
        } else {
            debug.inspect = true;
        }
    };
    onKeyRelease("1", toggleDebug);

    // Not exactly sure if destroying all objects needs
    // to be explicitly called on scene leave
    // onSceneLeave(() => {
    //     const allObjs = get("*", { recursive: true })
    //     for (const obj of allObjs) {
    //         destroy(obj);
    //     }
    // })
});

go("MainMenu");
