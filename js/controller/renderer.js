class Renderer
{
    constructor(dimension)
    {
        // 次元
        this._dimension = dimension;

        // キャンバスコントロール
        this._controll = document.getElementById("canvas");
        this.controll.width = 500;
        this.controll.height = 500;
        this._context = this.controll.getContext("2d");
    }

    // プロパティ
    get dimension()
    {
        return this._dimension;
    }
    get controll()
    {
        return this._controll;
    }
    get context()
    {
        return this._context;
    }

    // 描画
    clear()
    {
        this.context.clearRect(0, 0, 
            this.controll.width, 
            this.controll.height
        );
    }
    update()
    {
        this.clear();
        for (const figure of fcontroller.figures.filter((figure) => figure.isVisible())) 
        {
            figure.draw();
        }
    }
}