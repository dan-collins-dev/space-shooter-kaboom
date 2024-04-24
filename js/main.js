import { k, loadAssets} from "./modules/init.js"
import { createPlayer } from "./modules/entities/player.js";
import { createEnemy, increaseEnemySpeed, resetEnemySpeed } from "./modules/entities/enemy.js";
import { createLaser } from "./modules/entities/laser.js";
import { mainMenu } from "./modules/scenes/mainMenu.js";
import { gameplay } from "./modules/scenes/gamePlay.js";
import { data } from "./modules/data.js";

loadAssets()

// Game Over Scene (also testing for states)


go("MainMenu")
// go("GameOver")
