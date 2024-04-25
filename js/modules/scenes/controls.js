export const controlsMenu = scene("Controls", () => {
    let shipCenter = vec2(width() / 2 + 32, height() - height() / 4)
    let shipLeft = vec2(width() / 2 - 64, height() - height() / 4)
    let shipRight = vec2(width() / 2 + 128, height() - height() / 4)

    const sceneLabel = add([
        text("Controls", {
            size: 32,
            font: "PressStart2P",
        }),
        pos(width() / 2, 32),
        anchor("center")
    ])

    const backMsg = add([
        text("Spacebar to Menu", {
            size: 12,
            font: "PressStart2P",
        }),
        pos(center().x, 64),
        anchor("center")
    ])
    
    const spaceBtn = add([
        sprite("spacebar"),
        scale(3),
        pos(width() / 2 + 8, height() - height() / 3 + 128),
        timer()
    ])

    spaceBtn.add([
        text("Space", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        pos(6, 6)
    ])

    const createLaser = (shipPos) => {
        add([
            sprite("laser"),
            move(UP, 200),
            lifespan(1.5),
            pos(shipPos),
            scale(2)
        ])
    }

    spaceBtn.loop(1, () => {
        spaceBtn.frame = 0
        spaceBtn.children[0].textTransform.color = WHITE;
        spaceBtn.wait(.5, () => {
            spaceBtn.frame = 1
            spaceBtn.children[0].textTransform.color = BLACK;
            createLaser(ship.pos)
        })
    })

    const aBtn = add([
        sprite("key"),
        scale(3),
        pos(16, height() - height() / 4),
        timer()
    ])

    aBtn.add([
        text("A", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        pos(6, 6)
    ])

    const dBtn = add([
        sprite("key"),
        scale(3),
        pos(80, height() - height() / 4),
    ])

    dBtn.add([
        text("D", {
            size: 4,
            font: "PressStart2P",
            transform: {
                color: WHITE
            }
        }),
        pos(6, 6)
    ])

    const ship = add([
        sprite("playerShip"),
        scale(3),
        pos(shipRight),
        state("moveLeft", ["idle", "moveLeft", "moveRight"]),
    ])

    
    ship.onStateEnter("moveLeft", async () => {
        aBtn.frame = 1
        aBtn.children[0].textTransform.color = BLACK;

        dBtn.frame = 0;
        dBtn.children[0].textTransform.color = WHITE;

        await tween(
            ship.pos,
            shipLeft,
            1,
            (currentPos) => ship.pos = currentPos,
            easings.linear
        )

        ship.enterState("moveRight")
    })

    ship.onStateEnter("moveRight", async () => {
        aBtn.frame = 0
        aBtn.children[0].textTransform.color = WHITE;

        dBtn.frame = 1;
        dBtn.children[0].textTransform.color = BLACK;

        await tween(
            ship.pos,
            shipRight,
            1,
            (currentPos) => ship.pos = currentPos,
            easings.linear
        )
        ship.enterState("moveLeft")
    })

    onKeyRelease("space", () => {
        go("MainMenu")
    })
})