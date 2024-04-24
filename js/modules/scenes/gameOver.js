import { data } from "../data.js"
import { k } from "../init.js";

export const gameOver = scene("GameOver", () => {
    let states = add([
        state("idle", ["idle", "showScore"]),
        timer(),
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

    states.onStateEnter("idle", () => {
        states.wait(3, () => {
            states.enterState("showScore")
        })
        
        
    })

    states.onStateEnter("showScore", () => {
        msg.opacity = 1
        console.log(msg)

        msg.tween(
            num,
            data.score,
            5,
            (currentNum) => num = currentNum,
            easings.linear
        )
    }) 

    states.onStateUpdate("showScore", () => {
        msg.text = `Score: ${num.toFixed(0)}`;
    })
})

