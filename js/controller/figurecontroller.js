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
        return this.figures
                .filter((figure) => figure.contains(position));
    }
    getVisibleFigures(position)
    {
        return this.getPointedFigures(position)
                .filter((figure) => figure.isVisible());
    }
    getSelectableFigures(position)
    {
        return this.getVisibleFigures(position)
                .filter((figure) => figure.isSelectable() 
                                && !figure.isSelected());
    }
    getSelectedFigures(position) 
    {
        return this.getPointedFigures(position)
                .filter((figure) => figure.isSelected());
    }
    getMovableFigures(position)
    {
        return this.getSelectedFigures(position)
                .filter((figure) => figure.isMovable());
    }
}