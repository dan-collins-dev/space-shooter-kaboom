import { createExplosion } from "./explosion.js";

export const createLaser = (playerPos) => {
    const scoreRef = get("score")

    const laser = add([
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
        createExplosion(enemy.pos);
        destroy(enemy);
        scoreRef[0].trigger("scoreUp")
        destroy(laser);
    });
};
