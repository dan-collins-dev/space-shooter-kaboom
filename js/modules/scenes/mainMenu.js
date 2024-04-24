import { k } from "../init.js";

export const mainMenu = scene("MainMenu", () => {
    // debug.inspect = true;

    const titleMsg = add([
        text("Infinity Shot", {
            size: 8,
            font: "PressStart2P",
        }),
        anchor("center"),
        area(),
        pos(center().x, 160),
        timer(),
        rotate(0),
        state("zoom", ["zoom", "rotate"]),   
    ]);

    const options = ["Game", "Controls"]
    const optionSelectLbls = add([
        pos(center().x / 3 * 2, center().y),
    ])

    
    optionSelectLbls.add([
        text("Start Game", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(0, 0),
        area(),
    ])

    optionSelectLbls.add([
        text("Controls", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(0, 32),
        area()
    ])
    
    titleMsg.tween(
        titleMsg.textSize,
        32,
        1,
        (currentSize) => titleMsg.textSize = currentSize,
        easings.linear
    )

    titleMsg.tween(
        titleMsg.angle,
        360,
        1,
        (currentAngle) => titleMsg.angle = currentAngle,
        easings.linear
    )

    onKeyDown("enter", () => {
        k.score = 0;
        go("Game");
    });
});