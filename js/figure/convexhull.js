class ConvexHull extends Hull
{
    constructor(points, name = "")
    {
        super(points, name);

        // 重心
        this._center = new Point(new Vector([
            new Variable(() => this.getCenter(
                this.points.filter((point) => 
                    point.position.check((x) => !x.isError()) 
                    && this.contains(point.position) 
                    && fcontroller.canvas.contains(point.position)))
                .get(0).value()),
            new Variable(() => this.getCenter(
                this.points.filter((point) => 
                    point.position.check((x) => !x.isError())
                    && this.contains(point.position) 
                    && fcontroller.canvas.contains(point.position)))
                .get(1).value())
        ]), this.name + ".center");
    }

    get center()
    {
        return this._center;
    }
    getCenter(points) 
    {
        if (points.length == 0)
        {
            return Vector.convert([0, 0]);
        }

        return points.reduce((x, y) => 
                x.add(y.position), Vector.convert([0, 0]))
                    .div(Vector.convert([points.length, points.length]));
    }

    getOutPoints(points = null)
    {
        // 点集合が入力されなかった場合
        if (points == null)
        {
            points = this.points;
        }

        // console.log("---", this.name, this.id);
        // console.log("[" + points.map((point) => point.id) + "]");

        points = points.filter((point) => 
                    point.position.check((x) => !x.isError())
                    && this.contains(point.position)
                    && fcontroller.canvas.contains(point.position));

        // console.log("[" + points.map((point) => point.id) + "]");

        // 3点以下の場合はそのまま出力
        if (points.length <= 3)
        {
            return points;
        }

        // 点のリストをコピー
        points = points.slice();

        // 確認
        // for (const point of points)
        // {
        //     console.log(point.name, point.id, point.position.string);
        // }

        // 重心からの偏角でソート
        const e1 = Vector.convert([1, 0]);
        //const center = this.center.position.constant();
        const center = this.getCenter(points);
        points.sort((point1, point2) => {
            return getOrientedAngle(point1.position.sub(center), e1) 
                - getOrientedAngle(point2.position.sub(center), e1);
        });
        
        // console.log("[" + points.map((point) => point.id) + "]");
        
        // xy座標が最大の頂点を先頭に移動
        const x = Math.max.apply(null, points.map((point) => point.position.get(0).value()));
        let i = points.indexOf(points.find((point) => point.position.get(0).value() == x));
        points = points.slice(i, points.length).concat(points.slice(0, i));
    
        // 選択点を先頭2点で初期化
        const selecteds = points.splice(0, 2);

        // 残点の最後に先頭の頂点を追加
        points.push(selecteds[0]);

        // console.log("[" + selecteds.map((point) => point.id) + "]" 
        //     + "[" + points.map((point) => point.id) + "]");

        while (points.length != 0)
        {
            // 点を取得
            const point = points[0];

            let flag = true;
            do 
            {
                flag = Hull.CONTAINS(
                    selecteds[selecteds.length - 1].position, 
                [
                    this.center, 
                    selecteds[selecteds.length - 2], 
                    point
                ]);

                if (flag) 
                {
                    const last = selecteds.pop();
                    // console.log("del" + last.id + "[" + selecteds.map((point) => point.id) + "]" 
                    //     + "[" + points.map((point) => point.id) + "]");
                }
                
            } while (flag && selecteds.length >= 2);

            // 選択点に追加
            selecteds.push(points.shift());
            
            // console.log("add" + point.id + "[" + selecteds.map((point) => point.id) + "]" 
            //     + "[" + points.map((point) => point.id) + "]");
        }
    
        return selecteds;
    }
    
    draw(points = null)
    {
        super.draw(this.getOutPoints(points));
    }
    
    static mousedown(event) 
    {
        if (!econtroller.keys.has("f") && !econtroller.keys.has("F")) 
        {
            econtroller.convexhull = null;
            return;
        }

        const selecteds = fcontroller.figures.filter((figure) => figure.isSelected());

        if (selecteds.length == 0) 
        {
            econtroller.convexhull = null;
            return;
        }

        if (econtroller.convexhull == null) {
            econtroller.convexhull = new ConvexHull([], "convexhull");
        }

        console.log("[convexhull.mousedown]");

        econtroller.convexhull.points.length = 0;
        for (const point of selecteds.filter((figure) => figure instanceof Point)
                .filter((figure) => figure.id != econtroller.convexhull.center.id)) 
        {
            econtroller.convexhull.points.push(point);
        }
        
        econtroller.mousedown_select(event);
    }
}