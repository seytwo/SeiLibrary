class Point extends Figure {
    constructor(name, position) {
        super(name, position);

        // 半径
        this.diameters = {
            false : 5,
            true : 10
        };
    }

    contains(position) {
        const dx = position.sub(this.position);
        return dx.dot(dx) <= Math.pow(this.diameters[false], 2);
    }
    
    draw(){
        // 選択時
        if (this.isSelected()) {
            this._draw(true);
        }

        // メイン
        this._draw(false);
        
        // id
        canvas.context.fillText(this.id, 
            this.position.get(0).get() + this.diameters[false], 
            this.position.get(1).get() + 2 * this.diameters[false]);
    }
    _draw(selected) {
        canvas.context.beginPath();
        canvas.context.arc(
            this.position.get(0).get(), 
            this.position.get(1).get(), 
            this.diameters[selected], 
            0, 2 * Math.PI, false 
        );
        
        canvas.context.strokeStyle = this.colors[selected];
        canvas.context.fillStyle = this.colors[selected];
        canvas.context.fill();
        canvas.context.stroke();
    }
    
    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", Point.mousedown);
    }
    static mousedown(event, _this) { // _thisを無くしたい
        console.log("[point.mousedown]");

        // 図形を選択していない || コントロールを押している
        if (canvas.getSelectableFigures(canvas.pointer.position).length != 0 
                || canvas.getSelectedFigures(canvas.pointer.position).length != 0
                || !event.shiftKey) {
            return;
        } 

        // 点を生成
        new Point("point", canvas.pointer.position.value());

        // 図形を再選択
        canvas.mousedown_select(event, canvas);
    }
}
