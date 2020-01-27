class Hull extends Figure {
    constructor(name, points) {
        super(name);
        this.color = "rgba(255, 0, 0, 0.5)";
        this.color_selected = "rgba(255, 241, 0, 0.5)";
        this._points = points;
        this.drawPoints 
    }

    get points() {
        return this._points;
    }
    drawPoints() {
        return this.points;
    }
    add(point) {
        this._points.push(point);
    }
    reset() {
        this._points = [];
    }

    draw(){

        const points = this.drawPoints();

        if (points.length == 0) {
            return;
        }
        
        canvas.context.beginPath();
        canvas.context.moveTo(
            points[0].position.get(0).get(), 
            points[0].position.get(1).get()
        );
        for (const point of points) {
            canvas.context.lineTo(
                point.position.get(0).get(), 
                point.position.get(1).get()
            );
        }
        canvas.context.closePath();

        canvas.context.strokeStyle = "black";
        canvas.context.stroke();
        
        canvas.context.fillStyle = this.color;
        canvas.context.fill();
    }
    
    isSelected(point) {
        return contains(this.drawPoints(), point);
    }

    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", Hull.mousedown);
    }
    static mousedown(event, _this) {
        console.log("[hull.mousedown]");

        if (!_this.keys.has("q") && !_this.keys.has("Q")) {
            _this.hull = null;
            return;
        }

        if (_this.getSelectedFigure(event) == null) {
            _this.hull = null;
            return;
        }

        if (_this.hull == null) {
            _this.hull = new Hull("hull", []);
        }

        _this.hull.reset();
        for (const point of _this.selectedFigures) {
            _this.hull.points.push(point);
        }
        
        _this.mousedown_select(event, _this);
    }
}

function contains(points, point) {

    for (const point1 of points) {

        if (point.id == point1.id) {
            continue;
        }

        for (const point2 of points) {

            if (point.id == point2.id) {
                continue;
            }
            if (point1.id >= point2.id) {
                continue;
            }

            for (const point3 of points) {

                if (point.id == point3.id) {
                    continue;
                }    
                if (point2.id >= point3.id) {
                    continue;
                }

                const angle12 = getOrientedAngle(point1.position, point2.position, point.position);
                const angle23 = getOrientedAngle(point2.position, point3.position, point.position);
                const angle31 = getOrientedAngle(point3.position, point1.position, point.position);

                //console.log(point.id + "[" + point1.id + "," + point2.id + "," + point3.id + "]");

                if (Math.sign(angle12) == Math.sign(angle23) 
                        && Math.sign(angle23) == Math.sign(angle31)) {
                    return true;
                }
            }
        }
    }
    return false;
}
