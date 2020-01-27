class HalfSpace extends ConvexHull 
{
    constructor(name, arrow) 
    {
        // 四隅
        const corners = canvas.getCorners();
        for (const key in corners) {
            corners[key].visible = false;
            corners[key].clipped = true;
        }

        // 上下左右
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

        // 頂点の集合
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

        // 矢印
        this._arrow = arrow;

        // 頂点
        this._corners = corners;
        this._sides = sides;

        // 色
        this.colors[false] = "rgba(176, 196, 222, 0.5)";
    }

    // 矢印
    get arrow() 
    {
        return this._arrow;
    }

    // 頂点
    get corners() 
    {
        return this._corners;
    }
    get sides()
    {
        return this._sides;
    }

    // 描画頂点を取得
    drawPoints() 
    {
        return this.points.filter((point) =>
            this.arrow.direction.dot(point.position.sub(this.arrow.from.position)) >= -1 // マージンあり
            && 0 <= point.position.get(0).get() 
            && point.position.get(0).get() <= canvas.controll.width
            && 0 <= point.position.get(1).get() 
            && point.position.get(1).get() <= canvas.controll.height
        );
    }

    // イベントハンドラ
    static initializeEventHandler() 
    {
        canvas.addEventHandler(canvas, "mousedown", HalfSpace.mousedown);
    }
    static mousedown(event, _this) 
    {
        // fキーを押下していないとき
        if (!_this.keys.has("f") && !_this.keys.has("F")) 
        {
            return;
        }

        // 選択図形が複数のとき
        if (_this.getSelectedFigures(canvas.pointer.position).length != 1) 
        {
            return;
        }

        // 選択図形が矢印のとき
        if (_this.selectedFigures[0] instanceof Arrow) 
        {
            // 半空間を生成
            new HalfSpace("halfspace", _this.selectedFigures[0]);

            // 選択をリセット
            canvas.resetSelect();
        }
    }
}