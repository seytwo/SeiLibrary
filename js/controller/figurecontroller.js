class FigureController
{
    constructor()
    {
        fcontroller = this; // 応急処置
        this._figures = [];
        this._canvas = new Canvas();
        this._pointer = new Pointer();
    }

    get figures()
    {
        return this._figures;
    }
    add(figure)
    {
        this._figures.push(figure);
    }
    remove(figure)
    {
        throw "not implemented";
    }

    get canvas()
    {
        return this._canvas;
    }
    get pointer()
    {
        return this._pointer;
    }
    
    // 図形を取得
    getPointedFigures(position)
    {
        // 計算量削減のため定数化
        position = position.constant();

        // ポインタを含む図形を取得
        return this.figures
                .filter((figure) => figure.contains(position));
    }
    getVisibleFigures(position = null)
    {
        // 位置が入力されなかった場合，すべての図形を取得
        const figures = (position == null) ? 
            this.figures : this.getPointedFigures(position);

        // 描画する図形を取得
        return figures.filter((figure) => figure.isVisible());
    }
    getSelectableFigures(position = null)
    {
        return this.getVisibleFigures(position)
                .filter((figure) => figure.isSelectable() 
                                    && !figure.isSelected());
    }
    getSelectedFigures(position = null) 
    {
        return this.getVisibleFigures(position)
                .filter((figure) => figure.isSelected());
    }
    getMovableFigures(position = null)
    {
        return this.getSelectedFigures(position)
                .filter((figure) => figure.isMovable());
    }
}