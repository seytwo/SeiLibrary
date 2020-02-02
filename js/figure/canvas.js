class Canvas extends HyperCube
{
    constructor()
    {
        const left_top = new Point(Vector.convert([0, 0]), "canvas.left_top");
        const right_bottom = new Point(
            new Vector([
                new Variable(() => renderer.controll.width),
                new Variable(() => renderer.controll.height)
            ]), "canvas.right_bottom");
        left_top.visible = false;
        right_bottom.visible = false;

        super(left_top, right_bottom, "canvas");

        this.selectable = false;
        this.center.visible = false;

        for (const point of this.points)
        {
            point.visible = false;
        }
    }

    draw()
    {
        return; // 応急処置
    }
}