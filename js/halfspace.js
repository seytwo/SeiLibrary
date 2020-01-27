class HalfSpace extends ConvexHull {
    constructor(name, arrow) {

        const corners = canvas.getCorners();
        for (const key in corners) {
            corners[key].visible = false;
            corners[key].clipped = true;
        }

        const sides = {
            "top" : new Point("top", new Vector([
                new Variable(
                    () => arrow.from.position.get(0).get() - arrow.direction.get(1).get() 
                        / arrow.direction.get(0).get() * (0 - arrow.from.position.get(1).get())),
                new Constant(0)
            ])),
            "right" : new Point("right", new Vector([
                new Constant(canvas.controll.width),
                new Variable(
                    () => arrow.from.position.get(1).get() - arrow.direction.get(0).get() 
                        / arrow.direction.get(1).get() * (canvas.controll.width - arrow.from.position.get(0).get()))
            ])),
            "bottom" : new Point("bottom", new Vector([
                new Variable(
                    () => arrow.from.position.get(0).get() - arrow.direction.get(1).get() 
                        / arrow.direction.get(0).get() * (canvas.controll.height - arrow.from.position.get(1).get())),
                new Constant(canvas.controll.height)
            ])),
            "left" : new Point("left", new Vector([
                new Constant(0),
                new Variable(
                    () => arrow.from.position.get(1).get() - arrow.direction.get(0).get() 
                        / arrow.direction.get(1).get() * (0 - arrow.from.position.get(0).get()))
            ]))
        };
        for (const key in sides) {
            sides[key].visible = false;
        }

        const points = [
            corners["left_top"],
            sides["top"],
            corners["right_top"],
            sides["right"],
            corners["right_bottom"],
            sides["bottom"],
            corners["left_bottom"],
            sides["left"]
        ];

        super(name, points);
        this._arrow = arrow;
        this._corners = corners;
        this._sides = sides;
        this.selectable = false;
        this.color = "rgba(176, 196, 222, 0.5)";
    }
    get arrow() {
        return this._arrow;
    }

    drawPoints() {
        const points = [];
        for (const point of this.points) {
            if (this.arrow.direction.dot(point.position.sub(this.arrow.from.position)) >= -1
                    && 0 <= point.position.get(0).get() 
                    && point.position.get(0).get() <= canvas.controll.width
                    && 0 <= point.position.get(1).get() 
                    && point.position.get(1).get() <= canvas.controll.height) {
                points.push(point);
            }
        }
        return points;
    }

    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", HalfSpace.mousedown);
    }
    static mousedown(event, _this) {

        if (!_this.keys.has("f") && !_this.keys.has("F")) {
            return;
        }

        if (_this.selectedFigures.length != 1) {
            return;
        }

        if (_this.selectedFigures[0] instanceof Arrow) {
            new HalfSpace("halfspace", _this.selectedFigures[0]);
            canvas.resetSelect();
        }
    }
}