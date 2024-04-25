import { createPlayer } from "../entities/player.js";
import { createEnemy, increaseEnemySpeed, resetEnemySpeed } from "../entities/enemy.js";
import { createLaser } from "../entities/laser.js";
import { data } from "../data.js";

export const gameplay = scene("Game", () => {
    const player = createPlayer()
    let enemySpawnDelay = 3;
    let fireDelay = 0.01;

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
        text(`Score: ${data.score}`, {
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
        data.score += 100;
        scoreLabel.text = `Score: ${data.score}`;
        scoreLabel.enterState("expand")
    })

    scoreLabel.on("scoreDown", () => {
        data.score -= 50;
        if (data.score < 0) {
            data.score = 0
            resetEnemySpeed()
            go("GameOver")
        } 
        scoreLabel.text = `Score: ${data.score}`;
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
});