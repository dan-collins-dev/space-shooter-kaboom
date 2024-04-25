import { data } from "../data.js"

export const gameOver = scene("GameOver", () => {
    let receiveInput = false
    let states = add([
        state("idle", ["idle", "showScore", "done"]),
        timer(),
    ])

    const gameOverLbl = add([
        text("Game Over", {
            size: 32,
            font: "PressStart2P",
        }),
        pos(width()/ 2, height() / 4),
        anchor("center")
    ])

    let num = 0;
    let msg = add([
        text(`Score: ${num}`, {
            size: 16,
            font: "PressStart2P",
        }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        timer(),
        opacity(0)
    ])

    const backMsg = add([
        text("Spacebar to Menu", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(width() / 2, height() - 32),
        anchor("center"),
        timer(),
        opacity(0)
    ])

    states.onStateEnter("idle", () => {
        states.wait(1, () => {
            states.enterState("showScore")
        })
    })

    states.onStateEnter("showScore", async () => {
        msg.opacity = 1

        await msg.tween(
            num,
            data.score,
            3,
            (currentNum) => num = currentNum,
            easings.linear
        )

        states.enterState("done")
    })

    states.onStateEnter("done", () => {
        backMsg.opacity = 1
        receiveInput = true;
    })

    states.onStateUpdate("showScore", () => {
        msg.text = `Score: ${num.toFixed(0)}`;
    })

    onKeyRelease("space", () => {
        if (receiveInput === true) {
            go("MainMenu")
        }
    })
})

