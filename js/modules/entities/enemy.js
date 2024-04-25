import { data } from "../data.js";

let enemyMinSpeed = 75;
let enemyMaxSpeed = 100;

export const createEnemy = () => {

    const playerRef = get("player")
    const scoreRef = get("score")
    

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
        offscreen({ destroy: true, distance: 32}),
        move(DOWN, randi(enemyMinSpeed, enemyMaxSpeed)),
        fixed(),
    ]);

    enemy.onDestroy(() => {
        if (enemy.alive === true && playerRef[0].alive === true) {
            if (data.gameOver === false) {
                scoreRef[0].trigger("scoreDown")
            }
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