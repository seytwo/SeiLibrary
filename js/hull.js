class Hull extends Figure 
{
    constructor(name, points)
    {
        super(name);

        // 色
        this.colors[false] = "rgba(255, 0, 0, 0.5)";
        this.colors[true] = "rgba(255, 241, 0, 0.5)";

        // 頂点の集合
        this._points = points;
    }

    // 頂点
    get points() 
    {
        return this._points;
    }
    // 描画頂点
    drawPoints() 
    {
        return this.points;
    }
    // 頂点を追加
    add(point) 
    {
        this._points.push(point);
    }
    // 頂点をリセット
    reset() 
    {
        this._points = [];
    }

    // 描画
    draw()
    {
        // 描画頂点を取得
        const points = this.drawPoints();

        // 頂点が存在しない場合
        if (points.length == 0) {
            return;
        }
        
        // 輪郭を辿る
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

        // 輪郭を描画
        canvas.context.strokeStyle = "black";
        canvas.context.stroke();
        
        // 内部を描画
        canvas.context.fillStyle = this.colors[this.isSelected()];
        canvas.context.fill();
    }
    
    // 内外判定
    contains(point) 
    {
        return contains(this.drawPoints(), canvas.pointer); // テスト
    }

    // イベントハンドラ
    static initializeEventHandler() 
    {
        canvas.addEventHandler(canvas, "mousedown", Hull.mousedown);
    }
    static mousedown(event, _this) 
    {
        console.log("[hull.mousedown]");

        return; // とりま

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

// ベクトルの角度を取得
function getAngle(vector1, vector2, origin = null) 
{
    // 原点が入力されない場合
    if (origin == null) {
        origin = Vector.convert([0, 0]);
    }
    const direction1 = vector1.sub(origin);
    const direction2 = vector2.sub(origin);
    return Math.acos(direction1.unit().dot(direction2.unit()));
}
// ベクトルの符号付き角度を取得
function getOrientedAngle(vector1, vector2, origin = null) 
{
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

// 内外判定
function contains(points, point) 
{
    for (const point1 of points) 
    {
        if (point.id == point1.id) 
        {
            continue;
        }
        for (const point2 of points) 
        {
            if (point.id == point2.id) 
            {
                continue;
            }
            if (point1.id >= point2.id) 
            {
                continue;
            }
            for (const point3 of points) 
            {
                if (point.id == point3.id) 
                {
                    continue;
                }    
                if (point2.id >= point3.id) 
                {
                    continue;
                }
                const angle12 = getOrientedAngle(point1.position, point2.position, point.position);
                const angle23 = getOrientedAngle(point2.position, point3.position, point.position);
                const angle31 = getOrientedAngle(point3.position, point1.position, point.position);

                //console.log(point.id + "[" + point1.id + "," + point2.id + "," + point3.id + "]");

                if (Math.sign(angle12) == Math.sign(angle23) 
                    && Math.sign(angle23) == Math.sign(angle31)) 
                {
                    return true;
                }
            }
        }
    }
    return false;
}