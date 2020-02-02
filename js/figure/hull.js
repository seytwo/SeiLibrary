class Hull extends Figure
{
    constructor(points, name = "")
    {
        super(Vector.convert([0, 0]), name);

        // 色
        this.colors[false] = "rgba(255, 0, 0, 0.5)";
        this.colors[true] = "rgba(255, 241, 0, 0.5)";

        if (!(points instanceof Array))
        {
            throw "points is not Array";
        }
        this._points = points;

        //this.selectable = false;
    }
    
    // 頂点
    get points() 
    {
        return this._points;
    }

    // 内外判定
    contains(position, points = null)
    {
        if (points == null)
        {
            points = this.points;
        }

        return Hull.CONTAINS(position, points);
    }
    static CONTAINS(position, points = null) 
    {
        //console.log("---");
        for (const point1 of points) 
        {
            if (point1.position.isEqualTo(position)) 
            {
                return true;
            }
            for (const point2 of points) 
            {
                if (point2.position.isEqualTo(position)) 
                {
                    return true;
                }
                if (point1.id >= point2.id) 
                {
                    continue;
                }
                for (const point3 of points) 
                {
                    if (point3.position.isEqualTo(position)) 
                    {
                        return true;
                    }
                    if (point2.id >= point3.id) 
                    {
                        continue;
                    }

                    //console.log("" + point1.id + ", "+ point2.id + ", " + point3.id);

                    const angle12 = getOrientedAngle(point1.position, point2.position, position);
                    const angle23 = getOrientedAngle(point2.position, point3.position, position);
                    const angle31 = getOrientedAngle(point3.position, point1.position, position);

                    if (Math.sign(angle12) == Math.sign(angle23) 
                        && Math.sign(angle23) == Math.sign(angle31)) 
                    {
                        //console.log(true);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 描画
    draw(points = null)
    {
        // 描画頂点を取得
        if (points == null) 
        {
            points = this.points;
        }

        // 頂点が存在しない場合
        if (points.length == 0) {
            return;
        }
        
        // 輪郭を辿る
        renderer.context.beginPath();
        renderer.context.moveTo(
            points[0].position.get(0).value(), 
            points[0].position.get(1).value()
        );
        for (const point of points) {
            renderer.context.lineTo(
                point.position.get(0).value(), 
                point.position.get(1).value()
            );
        }
        renderer.context.closePath();

        // 輪郭を描画
        renderer.context.strokeStyle = "black";
        renderer.context.stroke();
        
        // 内部を描画
        renderer.context.fillStyle = this.colors[this.isSelected()];
        renderer.context.fill();
    }
    
    static mousedown(event) 
    {
        return;

        if (!econtroller.keys.has("f") && !econtroller.keys.has("F")) 
        {
            econtroller.hull = null;
            return;
        }

        const selecteds = fcontroller.figures.filter((figure) => figure.isSelected());

        if (selecteds.length == 0) 
        {
            econtroller.hull = null;
            return;
        }

        if (econtroller.hull == null) {
            econtroller.hull = new Hull([], "hull");
        }

        console.log("[hull.mousedown]");

        econtroller.hull.points.length = 0;
        for (const point of selecteds.filter((figure) => figure instanceof Point)) 
        {
            econtroller.hull.points.push(point);
        }
        
        econtroller.mousedown_select(event);
    }
}

// ベクトルの角度を取得
function getAngle(position1, position2, origin = null) 
{
    // 原点が入力されない場合
    if (origin == null) {
        origin = Vector.convert([0, 0]);
    }
    const direction1 = position1.sub(origin);
    const direction2 = position2.sub(origin);
    return Math.acos(direction1.unit().dot(direction2.unit()).value());
}
// ベクトルの符号付き角度を取得
function getOrientedAngle(position1, position2, origin = null) 
{
    if (origin == null) {
        origin = Vector.convert([0, 0]);
    }

    const direction1 = position1.sub(origin);
    const direction2 = position2.sub(origin);
    const angle = Math.acos(direction1.unit().dot(direction2.unit()).value());

    const sign = direction1.get(0).value() * direction2.get(1).value() 
        - direction1.get(1).value() * direction2.get(0).value();
    return Math.sign(sign) * angle;
}