class HyperCube extends Polyhedron
{
    constructor(point1, point2, name = "") 
    {
        const left_top = new Point(new Vector([
            new Variable(() => Math.min(
                point1.position.get(0).value(), 
                point2.position.get(0).value())),
            new Variable(() => Math.min(
                point1.position.get(1).value(), 
                point2.position.get(1).value()))
        ]), name + ".left_top");
        const right_bottom = new Point(new Vector([
            new Variable(() => Math.max(
                point1.position.get(0).value(), 
                point2.position.get(0).value())),
            new Variable(() => Math.max(
                point1.position.get(1).value(), 
                point2.position.get(1).value()))
        ]), name + ".right_bottom");

        const right_top = new Point(new Vector([
            right_bottom.position.get(0),
            left_top.position.get(1)
        ]), name + ".right_top");
        const left_bottom = new Point(new Vector([
            left_top.position.get(0),
            right_bottom.position.get(1)
        ]), name + ".left_bottom");

        left_top.visible = false;
        right_bottom.visible = false;
        right_top.visible = false;
        left_bottom.visible = false;

        const arrowTop = new Arrow(left_top, right_top, name + ".top");
        const arrowRight = new Arrow(right_top, right_bottom, name + ".right");
        const arrowBottom = new Arrow(right_bottom, left_bottom, name + ".bottom");
        const arrowLeft = new Arrow(left_bottom, left_top, name + ".left");

        arrowTop.visible = false;
        arrowRight.visible = false;
        arrowBottom.visible = false;
        arrowLeft.visible = false;

        super([arrowTop, arrowRight, arrowBottom, arrowLeft], name);

        this._point1 = point1;
        this._point2 = point2;

        for (const point of this.points)
        {
            point.visible = false;
        }
    }

    get point1()
    {
        return this._point1;
    }
    get point2()
    {
        return this._point2;
    }
}