class Segment extends ConvexHull 
{
    constructor(name, point1, point2) 
    {
        const dx = new Variable(() => 
            point2.position.get(0).get() 
            - point1.position.get(0).get());
        const dy = new Variable(() => 
            point2.position.get(1).get() 
            - point1.position.get(1).get());
        const length = new Variable(() => 
            Math.sqrt(Math.pow(dx.get(), 2) + Math.pow(dy.get(), 2)));
        const sin = new Variable(() => dy.get() / length.get());
        const cos = new Variable(() => dx.get() / length.get());

        const width = 5;
        const points = [
            new Point("point00", new Vector([
                new Variable(() => point1.position.get(0).get() 
                    + width * cos.get() - width * sin.get()),
                new Variable(() => point1.position.get(1).get() 
                    + width * sin.get() + width * cos.get())
            ])),
            new Point("point10", new Vector([
                new Variable(() => point1.position.get(0).get() 
                    + (length.get() - width) * cos.get() - width * sin.get()),
                new Variable(() => point1.position.get(1).get() 
                    + (length.get() - width) * sin.get() + width * cos.get())
            ])),
            new Point("point11", new Vector([
                new Variable(() => point1.position.get(0).get() 
                    + (length.get() - width) * cos.get() + width * sin.get()),
                new Variable(() => point1.position.get(1).get() 
                    + (length.get() - width) * sin.get() - width * cos.get())
            ])),
            new Point("point01", new Vector([
                new Variable(() => point1.position.get(0).get() 
                    + width * cos.get() + width * sin.get()),
                new Variable(() => point1.position.get(1).get() 
                    + width * sin.get() - width * cos.get())
            ]))
        ];
        for (const point of points) {
            point.visible = false;
        }
        
        super(name, points);

        // 色
        this.colors[false] = "black";
        this.colors[true] = "rgba(255, 0, 0, 0.5)";

        // 頂点
        this._point1 = point1;
        this._point2 = point2;
    }

    // 頂点
    get point1() 
    {
        return this._point1;
    }
    get point2() 
    {
        return this._point2;
    }

    draw()
    {
        // 輪郭を辿る
        canvas.context.beginPath();
        canvas.context.moveTo(this.point1.position.get(0).get(), this.point1.position.get(1).get());
        canvas.context.lineTo(this.point2.position.get(0).get(), this.point2.position.get(1).get());
        
        // 輪郭を描画
        canvas.context.strokeStyle = this.colors[this.isSelected()];
        canvas.context.stroke();

        // 選択領域を描画：デバッグ用
        //super.draw();
    }
}