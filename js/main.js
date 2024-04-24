import { k, loadAssets} from "./modules/init.js"
import { createPlayer } from "./modules/entities/player.js";
import { createEnemy, increaseEnemySpeed, resetEnemySpeed } from "./modules/entities/enemy.js";
import { createLaser } from "./modules/entities/laser.js";
import { mainMenu } from "./modules/scenes/mainMenu.js";
import { gameplay } from "./modules/scenes/gamePlay.js";
import { data } from "./modules/data.js";

loadAssets()

// Game Over Scene (also testing for states)
let gameOver = scene("GameOver", () => {
    let states = add([
        state("idle", ["idle", "keypress"]),
    ])

    let msg = add([
        text(`Score: ${data.score}`, {
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



go("MainMenu")
