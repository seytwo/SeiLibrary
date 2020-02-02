class EventController
{
    constructor()
    {
        this._handlers = 
        {
            mousemove : {},
            mousedown : {},
            mouseup : {},
            keydown : {},
            keyup : {},
        };

        this.initializeControllEventHandler();
        
        this._keys = new Set();
        this._dragging = false;
        this._from = null;

        this._hull = null;
        this._convexhull = null;
    }

    initializeControllEventHandler()
    {
        const _this = this;
        document.onkeydown = (event) => 
        {
            _this.keydown(event);
            _this.handle(event);
        };
        document.onkeyup = (event) => 
        {
            _this.keyup(event);
            _this.handle(event);
        };
        renderer.controll.onmousedown = (event) => 
        {
            _this.mousedown_select(event);
            _this.mousedown_move(event);
            Point.mousedown(event);
            Hull.mousedown(event);
            ConvexHull.mousedown(event);
            Arrow.mousedown(event);
            _this.handle(event);
        };
        renderer.controll.onmousemove = (event) => 
        {
            _this.mousemove_move(event);
            _this.handle(event);
        };
        renderer.controll.onmouseup = (event) => 
        {
            _this.mouseup_move(event);
            _this.handle(event);
        };
    }

    handle(event)
    {
        // ポインタにイベント引数を設定
        fcontroller.pointer.event = event;
        
        // ポインタの位置を取得
        const position = fcontroller.pointer.position.constant();

        // ポインタが上にある図形に対して
        for (const figure of fcontroller.getPointedFigures(position)
                .filter((figure) => figure.id in this._handlers[event.type])) 
        {
            for (const handler of this._handlers[event.type][figure.id]) 
            {
                figure[handler](event); // 要修正
            }
        }

        // 描写を更新
        renderer.update();
    }

    add(figure, type, handler)
    {
        if (!(figure.id in this._handlers[type]))
        {
            this._handlers[type][figure.id] = [];
        }
        this._handlers[type][figure.id].push(handler);
    }

    // キーイベントハンドラ
    get keys()
    {
        // 他クラスに追加されないようにコピー
        return new Set(this._keys);
    }
    keydown(event) 
    {
        this._keys.add(event.key);
    }
    keyup(event)
    {
        this._keys.delete(event.key);
        this._keys.delete(event.key.toUpperCase());
        this._keys.delete(event.key.toLowerCase());
    }

    // 選択イベントハンドラ
    mousedown_select(event)
    {
        console.log("[select.mousedown]");

        const position = fcontroller.pointer.position.constant();

        // 選択可能な図形を取得
        const selectables = fcontroller.getSelectableFigures(position);
        console.log("selectable", selectables);

        // 選択済みの図形を取得
        const selecteds = fcontroller.getSelectedFigures(position);
        console.log("selected  ", selecteds);

        // リセット：選択可能な図形がない，選択済みの図形がない
        // シフトキーを押していない(頂点連続生成のため) // 整理が必要
        // 単独選択：選択済み図形がなく，コントロールキーを押していない
        if (selectables.length == 0 && selecteds.length == 0 && !event.shiftKey
            || selecteds.length == 0 && !event.ctrlKey)
        {
            this.resetSelect();
        }
    
        // すべての選択可能図形に対して
        for (const figure of selectables) 
        {
            figure.selected = true;
        }
    }
    resetSelect() 
    {
        console.log("resetSelect");

        for (const figure of fcontroller.figures.filter((figure) => figure.isSelected()))
        {
            figure.selected = false;
        }
    }
    
    // 移動イベントハンドラ
    isDragging() 
    {
        return this._dragging;
    }
    mousedown_move(event) 
    {
        console.log("[move.mousedown]");

        this._from = fcontroller.pointer.position.constant();
        this._dragging = true;
    }
    mousemove_move(event)
    {
        if (!this.isDragging()) {
            return;
        }
        
        //console.log("[move.mousemove]");
        
        // 移動先の位置を取得
        const to = fcontroller.pointer.position.constant();

        // すべての選択図形に対して
        for (const figure of fcontroller.figures.filter((figure) => figure.isSelected())) 
        {
            // 移動後の位置を取得
            const position = figure.position.add(to.sub(this._from));

            // 更新
            figure.position.set(position);
        }

        // 移動前の位置を更新
        this._from = to;
    }
    mouseup_move(event)
    {
        console.log("[move.mouseup]");
        
        this._from = null;
        this._dragging = false;
    }
}