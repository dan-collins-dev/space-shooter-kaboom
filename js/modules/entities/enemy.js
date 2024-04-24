import { k } from "../init.js";

let enemyMinSpeed = 75;
let enemyMaxSpeed = 100;

export const createEnemy = () => {

    const playerRef = k.get("player")
    const scoreRef = k.get("score")

    let enemy = add([
        sprite("enemyShip"),
        scale(3),
        anchor("center"),
        pos(randi(24, width() - 24), 0),
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

    enemy.onDestroy(() => {
        if (enemy.alive && playerRef[0].alive) {
            scoreRef[0].trigger("scoreDown")
        }
    });

    return enemy
}

export const increaseEnemySpeed = () => {
    enemyMinSpeed += 25
    enemyMaxSpeed += 50
}

export const resetEnemySpeed = () => {
    enemyMinSpeed = 75;
    enemyMaxSpeed = 100;
}