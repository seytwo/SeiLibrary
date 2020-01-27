class ConvexHull extends Hull 
{
    constructor(name, points) 
    {
        super(name, points);

        // 重心
        this._center = new Point("center", new Vector([
            new Variable(() => getCenter(this.points).get(0).get()),
            new Variable(() => getCenter(this.points).get(1).get())
        ]));
        this._center.visible = false;
    }

    // 重心
    get center() 
    {
        return this._center;
    }

    // 描画頂点
    drawPoints() 
    {
        return GrahamScan(this);
    }
    
    // イベントハンドラ
    static initializeEventHandler() 
    {
        canvas.addEventHandler(canvas, "mousedown", ConvexHull.mousedown);
    }
    static mousedown(event, _this) 
    {
        console.log("[convexhull.mousedown]");

        // xが押下されていない場合
        if (!_this.keys.has("x") && !_this.keys.has("X")) 
        {
            // 凸包の作成をリセット
            _this.convexhull = null;
            return;
        }

        // 凸法を作成していない場合
        if (_this.convexhull == null) 
        {
            // 凸法を初期化
            _this.convexhull = new ConvexHull("convexhull", []);
        }

        // 凸法の頂点をリセット
        _this.convexhull.reset();

        // すべての選択済みの頂点に対して
        for (const figure of _this.selectedFigures
                .filter((figure) => figure instanceof Point)) 
        {
            // 凸法に追加
            _this.convexhull.points.push(figure);
        }
    }
}

function Elimination(points) 
{
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

function GrahamScan(convexhull) 
{
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

// 重心を取得
function getCenter(points) 
{
    let center = Vector.convert([0, 0]);
    for (const point of points) {
        center = center.add(point.position);
    }
    return center.div(Vector.convert([points.length, points.length]));
}