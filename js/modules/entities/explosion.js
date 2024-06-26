export const createExplosion = (position) => {
    const boom = add([
        sprite("explosion", {anim: "explode"}),
        scale(3),
        pos(position.x, position.y),
        anchor("center"),
        area(),
        lifespan(1),
        fixed(),
    ])
    play("explosion", {volume: 0.1})
    return boom;
}