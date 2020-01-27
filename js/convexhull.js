class ConvexHull extends Hull {
    constructor(name, points) {
        super(name, points);
        this.color = "rgba(255, 0, 0, 0.5)";

        this._center = new Point("center", new Vector([
            new Variable(() => getCenter(this.points).get(0).get()),
            new Variable(() => getCenter(this.points).get(1).get())
        ]));
        this._center.visible = false;
    }

    get center() {
        return this._center;
    }

    drawPoints() {
        return GrahamScan(this);
    }
    
    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", ConvexHull.mousedown);
    }
    static mousedown(event, _this) {
        console.log("[convexhull.mousedown]");

        if (!_this.keys.has("x") && !_this.keys.has("X")) {
            _this.convexhull = null;
            return;
        }

        if (_this.convexhull == null) {
            _this.convexhull = new ConvexHull("convexhull", []);
        }

        _this.convexhull.reset();
        for (const point of _this.selectedFigures) {
            if (point instanceof Point) {
                _this.convexhull.points.push(point);
            }
        }
        
        //_this.mousedown_select(event, _this);
    }
}

function getAngle(vector1, vector2, origin = null) {
    if (origin == null) {
        origin = Vector.convert([0, 0]);
    }
    const direction1 = vector1.sub(origin);
    const direction2 = vector2.sub(origin);
    return Math.acos(direction1.unit().dot(direction2.unit()));
}
function getOrientedAngle(vector1, vector2, origin = null) {
    if (origin == null) {
        origin = Vector.convert([0, 0]);
    }
    const direction1 = vector1.sub(origin);
    const direction2 = vector2.sub(origin);
    const angle = Math.acos(direction1.unit().dot(direction2.unit()));

    const sign = direction1.get(0).get() * direction2.get(1).get() 
        - direction1.get(1).get() * direction2.get(0).get();
    return Math.sign(sign) * angle;
}

function Elimination(points) {
    if (points.length <= 3) {
        return points;
    }

    const selecteds = [];
    for (const point of points) {
        if (!contains(points, point)) {
            selecteds.push(point);
        }
    }

    return selecteds;
}

function GrahamScan(convexhull) {

    let points = convexhull.points;
    const CENTER = convexhull.center;
    const POINTS = [];

    if (points.length <= 3) {
        return points;
    }

    //console.log("---");
    //console.log(points);

    POINTS.length = 0;
    for (const point of points) {
        POINTS.push(point);
    }

    const center = getCenter(points);

    const e1 = Vector.convert([1, 0]);

    points.sort((point1, point2) => {
        return getOrientedAngle(point1.position.sub(center), e1) 
            - getOrientedAngle(point2.position.sub(center), e1);
    });
    
    const x = Math.max.apply(null, points.map((point) => point.position.get(0).get()));
    let i = points.indexOf(points.find((point) => point.position.get(0).get() == x));
    points = points.slice(i, points.length).concat(points.slice(0, i));
    
    //console.log("[" + points.map((point) => point.id) + "]");

    const selecteds = points.splice(0, 2);
    points.push(selecteds[0]);
    for (i = 0; i < points.length; i++) {
        const point = points[i];
        let flag = true;
        do {
            flag = contains([CENTER, selecteds[selecteds.length - 2], point], 
                selecteds[selecteds.length - 1]);
            if (flag) {
                const last = selecteds.pop();
                //console.log("del" + last.id + "[" + points.map((point) => point.id) + "]");            
            }
        } while (flag && selecteds.length >= 2);
        selecteds.push(point);
        //console.log("add" + point.id + "[" + points.map((point) => point.id) + "]");  
    }

    //console.log(selecteds);

    return selecteds;
}
function getCenter(points) {
    let center = Vector.convert([0, 0]);
    for (const point of points) {
        center = center.add(point.position);
    }
    return center.div(Vector.convert([points.length, points.length]));
}