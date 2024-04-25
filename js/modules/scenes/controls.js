// import { k } from "../init.js";

export const controlsMenu = scene("Controls", () => {
    const sceneLabel = add([
        text("Controls", {
            size: 32,
            font: "PressStart2P",
        }),
        pos(width() / 2, 32),
        anchor("center")
    ])
    
    const spaceBtn = add([
        sprite("spaceIdle"),
        scale(3),
        pos(0, 0),
    ])

    spaceBtn.add([
        text("Space", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        // anchor("center"),
        pos(6, 6)
    ])

    const aBtn = add([
        sprite("keyIdle"),
        scale(3),
        pos(0, width() / 6),
    ])

    aBtn.add([
        text("A", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        // anchor("center"),
        pos(6, 6)
    ])

    const dBtn = add([
        sprite("keyIdle"),
        scale(3),
        pos(64, width() / 6),
    ])

    dBtn.add([
        text("D", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        // anchor("center"),
        pos(6, 6)
    ])
})