class Figure
{
    constructor(position, name = "")
    {
        if (typeof name != "string")
        {
            throw "name is not String";
        }
        if (position instanceof Array)
        {
            position = Vector.convert(position);
        }
        if (!(position instanceof Vector))
        {
            throw "position is not Vector";
        }
        
        // 基本情報
        this._id = fcontroller.figures.length;
        this._name = name;
        console.log(this.constructor.name + ":" + this.name + "[" + this.id + "]");

        // 位置：ベクトル
        this._position = position;

        // フラグ
        this._visible = true;
        this._selectable = true;
        this._selected = false;
        this._movable = true;
        
        // 描画色：{ selected : color }
        this._colors = 
        {
            false : "black",
            true : "rgba(255, 0, 0, 0.5)"
        };
        
        // コントローラに追加
        fcontroller.add(this);
    }

    // 基本情報
    get id()
    {
        return this._id;
    }
    get name()
    {
        return this._name;
    }

    // 位置
    get position()
    {
        return this._position;
    }
    
    // フラグ
    isVisible()
    {
        return this._visible && this.position.check((x) => !x.isError());
    }
    set visible(value)
    {
        this._visible = value;
    }
    isSelectable()
    {
        return this._selectable;
    }
    set selectable(value)
    {
        this._selectable = value;
    }
    isSelected()
    {
        return this._selected;
    }
    set selected(value)
    {
        this._selected = value;
    }
    isMovable()
    {
        return this._movable;
    }
    set movable(value) 
    {
        this._movable = value;
    }
    isPointed()
    {
        return this.contains(fcontroller.pointer.position);
    }

    // 内外判定
    contains(point)
    {
        throw "not implemented";
    }

    // 描画
    get colors()
    {
        return this._colors;
    }
    draw()
    {
        throw "not implemented";
    }
}