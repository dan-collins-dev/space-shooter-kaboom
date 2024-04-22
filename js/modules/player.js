import { createExplosion } from "./explosion.js";
import { resetEnemySpeed } from "./enemy.js";

export const createPlayer = () => {
    const player = add([
        sprite("playerShip"),
        scale(3),
        anchor("center"),
        pos(center().x, height() - 40),
        area(),
        "player",
        {
            speed: 240,
            offset: 24,
            alive: true,
            dmgShakeFactor: 25
        },
        health(3),
        timer(),
    ]);

    player.onCollide("enemy", (e) => {
        destroy(e);
        shake(player.dmgShakeFactor);
        player.hurt(1);
    });

    player.on("death", () => {
        player.alive = false;
        resetEnemySpeed()
        createExplosion(player.pos)
        destroy(player);
        go("MainMenu")
    });

    return player
}