class Point extends Figure
{
    constructor(position, name = "")
    {
        super(position, name);

        // 半径
        this._diameters =
        {
            false : new Constant(5),
            true : new Constant(10)
        }
    }

    // 半径
    get diameters()
    {
        return this._diameters;
    }

    // 内外判定
    contains(position)
    {
        const residue = this.getResidue(position);
        return !residue.sub(this.diameters[false].pow(2)).isNonNegative();
    }
    getResidue(position)
    {
        const dx = position.sub(this.position);
        return dx.dot(dx);
    }
    
    // 描写
    draw()
    {
        // 選択時
        if (this.isSelected()) 
        {
            this._draw(true);
        }

        // メイン
        this._draw(false);
        
        // id
        const width = this.position.get(0).value() >= renderer.controll.width ? 25 : 0;
        const height = this.position.get(1).value() >= renderer.controll.height ? 15 : 0;
        renderer.context.fillText(this.id, 
            this.position.get(0).value() + this.diameters[false].value() - width, 
            this.position.get(1).value() + 2 * this.diameters[false].value() - height);
    }
    _draw(selected) 
    {
        renderer.context.beginPath();
        renderer.context.arc(
            this.position.get(0).value(), 
            this.position.get(1).value(), 
            this.diameters[selected].value(), 
            0, 2 * Math.PI, false 
        );
        
        renderer.context.strokeStyle = this.colors[selected];
        renderer.context.fillStyle = this.colors[selected];
        renderer.context.fill();
        renderer.context.stroke();
    }
    
    // イベントハンドラ
    static mousedown(event) 
    {
        console.log("[point.mousedown]");

        // ポインタの位置を取得
        const position = fcontroller.pointer.position.constant();

        // 選択可能図形がある，図形を選択していない，コントロールを押している
        if (fcontroller.getSelectableFigures(position).length != 0 
                || fcontroller.getSelectedFigures(position).length != 0
                || !event.shiftKey) 
        {
            return;
        } 

        // 点を生成
        new Point(position, "point");

        // 図形を再選択
        econtroller.mousedown_select(event);
    }
}