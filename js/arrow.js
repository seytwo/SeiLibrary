class Arrow extends Segment {
    constructor(name, from, to) {
        super(name, from, to);
        this._direction = new Vector([
            new Variable(() => this.to.position.get(0).get() - this.from.position.get(0).get()),
            new Variable(() => this.to.position.get(1).get() - this.from.position.get(1).get())
        ]);
    }
    get from() {
        return this.point1;
    }
    get to() {
        return this.point2;
    }
    get direction() {
        return this._direction;
    }

    draw(){
        super.draw();

        const startX = this.from.position.get(0).get();
        const startY = this.from.position.get(1).get();
        const endX = this.to.position.get(0).get();
        const endY = this.to.position.get(1).get();

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

        for (var i = 0; i < positions.length; i += 2) {

            var x = positions[i] * cos - positions[i + 1] * sin + startX;
            var y = positions[i] * sin + positions[i + 1] * cos + startY;
            
            if (i === 0) {
                canvas.context.moveTo(x, y);
            } else {
                canvas.context.lineTo(x, y);
            }
        }

        if (this.selected) {
            canvas.context.strokeStyle = this.color_selected;
            canvas.context.fillStyle = this.color_selected;
        } else {
            canvas.context.strokeStyle = this.color;
            canvas.context.fillStyle = this.color;
        }

        canvas.context.fill();
        canvas.context.stroke();
    }
    
    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", Arrow.mousedown);
    }
    static mousedown(event, _this) {
        console.log("[arrow.mousedown]");

        if (!_this.keys.has("q") && !_this.keys.has("Q")) {
            return;
        }

        if (_this.selectedFigures.length != 2) {
            return;
        }

        if (_this.selectedFigures[0] instanceof Point
                && _this.selectedFigures[1] instanceof Point) {
            new Arrow("arrow", _this.selectedFigures[0], _this.selectedFigures[1]);
            canvas.resetSelect();
        }
    }
}