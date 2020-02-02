class Arrow extends Segment
{
    constructor(from, to, name) 
    {
        super(from, to, name);

        // 向き
        this._direction = new Vector([
            new Variable(() => this.to.position.get(0).value() 
                                - this.from.position.get(0).value()),
            new Variable(() => this.to.position.get(1).value() 
                                - this.from.position.get(1).value())
        ]);

        // 色
        this.colors[true] = "rgba(255, 0, 0, 0.7)";
    }
    
    get from()
    {
        return this.point1;
    }
    get to()
    {
        return this.point2;
    }
    get direction()
    {
        return this._direction;
    }

    draw()
    {
        const startX = this.from.position.get(0).value();
        const startY = this.from.position.get(1).value();
        const endX = this.to.position.get(0).value();
        const endY = this.to.position.get(1).value();

        var dx = endX - startX;
        var dy = endY - startY;
        var len = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / len;
        var cos = dx / len;

        const controlPoints = [0, 0.2, -15, 0, -15, 5];

        var positions = [];
        
        positions.push(0, 0);

        for (var i = 0; i < controlPoints.length; i += 2) {
            var x = controlPoints[i];
            var y = controlPoints[i + 1];
            positions.push(x < 0 ? len + x : x, y);
        }

        positions.push(len, 0);

        for (var i = controlPoints.length; i > 0; i -= 2) {
            var x = controlPoints[i - 2];
            var y = controlPoints[i - 1];
            positions.push(x < 0 ? len + x : x, -y);
        }

        positions.push(0, 0);

        renderer.context.beginPath();
        renderer.context.moveTo(
            positions[0] * cos - positions[0 + 1] * sin + startX, 
            positions[0] * sin + positions[0 + 1] * cos + startY
        );

        for (var i = 2; i < positions.length; i += 2) {

            var x = positions[i] * cos - positions[i + 1] * sin + startX;
            var y = positions[i] * sin + positions[i + 1] * cos + startY;
            
            if (i === 0) {
                renderer.context.moveTo(x, y);
            } else {
                renderer.context.lineTo(x, y);
            }
        }

        renderer.context.closePath();

        renderer.context.strokeStyle = this.colors[this.isSelected()];
        renderer.context.fillStyle = this.colors[this.isSelected()];
        renderer.context.fill();
        renderer.context.stroke();
    }
    
    // イベントハンドラ
    static mousedown(event, _this) 
    {
        if (!econtroller.keys.has("q") && !econtroller.keys.has("Q")) 
        {
            return;
        }

        const selecteds = fcontroller.figures.filter(
            (figure) => figure.isSelected() && figure instanceof Point);
        if (selecteds.length != 2) 
        {
            return;
        }

        console.log("[arrow.mousedown]");

        // 矢印を作成
        new Arrow(selecteds[0], selecteds[1], "arrow");
        
        // 選択をリセット
        econtroller.resetSelect();
    }
}