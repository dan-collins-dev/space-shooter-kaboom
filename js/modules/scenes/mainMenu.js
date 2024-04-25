import { k, toggleDebug} from "../init.js";
import { data } from "../data.js";
import { controlsMenu } from "./controls.js";

export const mainMenu = scene("MainMenu", () => {
    let receiveInput = false;

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
        state("zoom", ["zoom", "idle"]),
    ]);

    titleMsg.onStateEnter("zoom", async () => {
        await animateTitle();
        optionSelectLbls.wait(2, () => {
            optionSelectLbls.enterState("moving");
        });
    });

    const animateTitle = async () => {
        titleMsg.tween(
            titleMsg.textSize,
            32,
            1,
            (currentSize) => (titleMsg.textSize = currentSize),
            easings.linear
        );

        titleMsg.tween(
            titleMsg.angle,
            360,
            1,
            (currentAngle) => (titleMsg.angle = currentAngle),
            easings.linear
        );
    };

    const optionSelectLbls = add([
        pos(center().x - width(), center().y),
        timer(),
        state("offscreen", ["offscreen", "moving", "static"]),
    ]);

    optionSelectLbls.onStateEnter("moving", async () => {
        await tween(
            optionSelectLbls.pos,
            vec2((center().x / 3) * 2, center().y),
            1,
            (currentPos) => (optionSelectLbls.pos = currentPos),
            easings.easeInCubit
        );
        optionSelectLbls.enterState("static");
    });

    optionSelectLbls.onStateEnter("static", () => {
        receiveInput = true;
        selectCursor.opacity = 1;
    });

    let selectIndex = 0;
    const selectCursor = add([
        pos(center().x / 3 + 32, center().y),
        sprite("cursor"),
        {
            startPos: vec2(center().x / 3 + 32, center().y),
            controlsPos: vec2(center().x / 3 + 32, center().y + 32),
        },
        area(),
        opacity(0),
    ]);

    optionSelectLbls.add([
        text("Start Game", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(0, 0),
        area(),
    ]);

    optionSelectLbls.add([
        text("Controls", {
            size: 16,
            font: "PressStart2P",
        }),
        pos(0, 32),
        area(),
    ]);

    onKeyRelease("enter", () => {
        if (receiveInput === true) {
            data.score = 0;
            if (selectIndex === 0) go("Game");
            else go("Controls")
        }
    });

    onKeyRelease("s", () => {
        if (receiveInput === true) {
            if (selectIndex === 0) {
                selectCursor.pos = selectCursor.controlsPos;
                selectIndex = 1;
            } else {
                selectCursor.pos = selectCursor.startPos;
                selectIndex = 0;
            }
            play("selectSound", {volume: 0.1});
        }
    });

    onKeyRelease("w", () => {
        if (receiveInput === true) {
            if (selectIndex === 0) {
                selectCursor.pos = selectCursor.controlsPos;
                selectIndex = 1;
            } else {
                selectCursor.pos = selectCursor.startPos;
                selectIndex = 0;
            }
            play("selectSound", {volume: 0.1});
        }
    });
});
