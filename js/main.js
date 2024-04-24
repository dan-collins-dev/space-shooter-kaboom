import { k, loadAssets } from "./modules/init.js"
import { createPlayer } from "./modules/player.js";
import { createEnemy, increaseEnemySpeed, resetEnemySpeed } from "./modules/enemy.js";
// import { createExplosion } from "./modules/explosion.js";
import { createLaser } from "./modules/laser.js";
import { mainMenu } from "./modules/scenes/mainMenu.js";


loadAssets()

let score = 0;
let enemySpawnDelay = 3;
let fireDelay = 0.01;

// Game Over Scene (also testing for states)
let gameOver = scene("GameOver", () => {
    let states = add([
        state("idle", ["idle", "keypress"]),
    ])

    let msg = add([
        text(`Score: ${score}`, {
            size: 16,
            font: "PressStart2P",
        }),
        pos(width() / 2, height() / 2),
        anchor("center"),
    ])

    states.onStateEnter("idle", () => {

    })

    states.onStateEnter("keypress", () => {
        console.log("entering keypress state")
    })

    onKeyRelease("a", () => states.enterState("keypress"))
})

// Main Menu Scene



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
            go("GameOver")
        } 
        scoreLabel.text = `Score: ${score}`;
        scoreLabel.enterState("shrink");
    })

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
            createLaser(player.pos);
            play("shoot", {volume: 0.1})
        } else {
            player.wait(fireDelay, () => player.onCoolDown = false);
        }
    });

    spawnEnemy();

    const toggleDebug = () => {
        if (debug.inspect === true) {
            debug.inspect = false;
        } else {
            debug.inspect = true;
        }
    };
    onKeyRelease("1", toggleDebug);
});

go("MainMenu")
