class Base {
    constructor(id, name, position = null) 
    {
        // 基本情報
        this._id = id;
        this.name = name;

        // 位置：ベクトル
        if (position == null) 
        {
            position = Vector.convert([0, 0]);
        }
        if (!(position instanceof Vector)) 
        {
            throw "not vector"
        }
        this._position = position;
        
        // フラグ
        this._visible = true;
        this._selectable = true;
        this._movable = false;
        this._pointed = false;
        
        // イベントハンドラ
        this.eventHandlers = 
        {
            mousemove : {},
            mousedown : {},
            mouseup : {},
            keydown : {},
            keyup : {},
        };
    }

    // 基本情報
    get id() 
    {
        return this._id;
    }

    // 位置
    get position() 
    {
        return this._position;
    }

    // フラグ
    isSelected() 
    {
        return this.id in canvas.selectedFigureMap;
    }
    isSelectable() 
    {
        return this._selectable;
    }
    set selectable(value) 
    {
        this._selectable = value;
    }
    isVisible() 
    {
        return this._visible;
    }
    set visible(value) 
    {
        this._visible = value;
    }
    isMovable() 
    {
        return this._movable;
    }
    set movable(value) {
        this._movable = value;
    }
    isPointed() 
    {
        return this._pointed;
    }
    set pointed(value)
    {
        this._pointed = value;
    }

    // 指定の位置を含んでいるかを判定
    contains(position) 
    {
        return false;
    }
    
    // イベントハンドラを追加
    addEventHandler(figure, eventType, eventHandler) 
    {
        if (!(figure.id in this.eventHandlers[eventType])) {
            this.eventHandlers[eventType][figure.id] = []; // 消すとき困る？
        }
        this.eventHandlers[eventType][figure.id].push(eventHandler);
    }
    removeEventHandler() 
    {

    }
}