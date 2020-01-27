class Canvas extends Base {
    constructor() {
        super(-1, "canvas");
        this.visible = false;
        this.selectable = false;

        //
        canvas = this;

        // キャンバス上の図形
        this.figures = [];
        this.figureMap = {};
        this.addFigure(this);

        // キャンバスコントロールの設定
        this.controll = document.getElementById("canvas");
        this.controll.width = 500;
        this.controll.height = 500;

        // コンテキスト
        this.context = this.controll.getContext("2d");

        // イベントハンドラ
        this.initializeCanvasEventHandler();

        // ポインタ // 最初に実行されるべき?
        this.pointer = new Pointer();

        // キーイベントハンドラ
        this.keys = new Set();
        this.initializeKeyEventHandler();
        
        // 選択イベントハンドラ
        this.selectedFigures = [];
        this.selectedFigureMap = {};
        this.initializeSelectEventHandler();

        // 移動イベントハンドラ
        this.from = null;
        this._dragging = false;
        this.initializeMoveEventHandler();

        // 点作成イベントハンドラ
        Point.initializeEventHandler();

        // 包作成イベントハンドラ
        this.hull = null;
        Hull.initializeEventHandler();

        // 凸包作成イベントハンドラ
        this.convexhull = null;
        ConvexHull.initializeEventHandler();

        // 矢印作成イベントハンドラ
        Arrow.initializeEventHandler();
        
        // 半空間作成イベントハンドラ
        HalfSpace.initializeEventHandler();
        
        // 多面体作成イベントハンドラ
        Polyhedron.initializeEventHandler();
        
    }

    isDragging() {
        return this._dragging;
    }
    set dragging(value) {
        this._dragging = value;
    }

    contains(position) {
        return true; // イベントハンドラを起動するため
    }

    getCorners(){
        return {
            "left_top" : new Point("left_top", 
                Vector.convert([ 0, 0 ])),
            "right_top" : new Point("right_top", new Vector([
                new Variable(() => canvas.controll.width),
                new Constant(0)
            ])),
            "left_bottom" : new Point("left_bottom", new Vector([
                new Constant(0),
                new Variable(() => canvas.controll.height)
            ])),
            "right_bottom" : new Point("right_bottom", new Variable([
                new Variable(() => canvas.controll.width),
                new Variable(() => canvas.controll.height)
            ]))
        };
    }

    addFigure(figure){
        this.figures.push(figure);
        this.figureMap[figure.id] = figure;
    }
    removeFigure(figure){
        // 
    }

    initializeCanvasEventHandler(){
        const _this = this;
        this.controll.onmousemove = (event) => {
            _this.canvasEventHandler(event);
        };
        this.controll.onmousedown = (event) => {
            _this.canvasEventHandler(event);
        };
        this.controll.onmouseup = (event) => {
            _this.canvasEventHandler(event);
        };
        document.onkeydown = (event) => {
            _this.canvasEventHandler(event);
        };
        document.onkeyup = (event) => {
            _this.canvasEventHandler(event);
        };
    }
    canvasEventHandler(event) {

        // イベント引数を更新 // 無くしたい
        if (event.clientX != undefined) {
            this.pointer.event = event;
        }

        // ポインタが重ねられている図形のイベントハンドラを実行
        const figures = this.getPointedFigures(this.pointer.position);
        //console.log("---", event.type);
        for (const figure of figures) {
            //console.log(figure);
            for (const eventHandler of this.eventHandlers[event.type][figure.id]) {
                eventHandler(event, figure);
            }
        }

        // 描写を更新
        this.update();
    }

    getPointedFigures(position)
    {
        const figures = [];
        for (const figure of this.figures) 
        {
            if (figure.contains(position))
            {
                figures.push(figure);
            }
        }
        return figures;
    }
    getVisibleFigures(position)
    {
        return this.getPointedFigures(position).filter(
            (figure) => figure.isVisible());
    }
    getSelectableFigures(position)
    {
        // 選択可能で未選択の図形
        return this.getVisibleFigures(position).filter(
            (figure) => figure.isSelectable() && !figure.isSelected());
    }
    getSelectedFigures(position) {
        return this.getVisibleFigures(position).filter(
            (figure) => figure.isSelected());
    }
    getMovableFigures(position)
    {
        return this.getSelectableFigures(position).filter(
            (figure) => figure.isMovable());
    }

    initializeKeyEventHandler() {
        this.addEventHandler(this, "keydown", this.keydown);
        this.addEventHandler(this, "keyup", this.keyup);
    }
    keydown(event, _this) {
        _this.keys.add(event.key);
    }
    keyup(event, _this) {
        _this.keys.delete(event.key);
        _this.keys.delete(event.key.toUpperCase());
        _this.keys.delete(event.key.toLowerCase());
    }

    initializeSelectEventHandler(){
        this.addEventHandler(this, "mousedown", this.mousedown_select);
    }
    mousedown_select(event, _this){
        console.log("[select.mousedown]");

        const figures = _this.getSelectableFigures(_this.pointer.position);

        // リセット
        if (figures.length == 0 && !event.shiftKey) {
            _this.resetSelect();
        }

        for (const figure of figures) {
            
            // 選択
            if (!event.ctrlKey) {
                _this.resetSelect();
                
                _this.selectedFigures.push(figure);
                _this.selectedFigureMap[figure.id] = figure;
                figure.selected = true;
            }
    
            // 追加
            if (event.ctrlKey) {
                _this.selectedFigures.push(figure);
                _this.selectedFigureMap[figure.id] = figure;
                figure.selected = true;
            }
        }
    }
    resetSelect() {
        console.log("resetSelect");

        for (const figure of this.selectedFigures) {
            figure.selected = false;
        }
        this.selectedFigures = [];
        this.selectedFigureMap = {};
    }

    initializeMoveEventHandler(){
        this.addEventHandler(this, "mousedown", this.mousedown_move);
        this.addEventHandler(this, "mousemove", this.mousemove_move);
        this.addEventHandler(this, "mouseup", this.mouseup_move);
    }
    mousedown_move(event, _this) {
        console.log("[move.mousedown]");

        _this.from = _this.pointer.position.value();
        _this.dragging = true;
    }
    mousemove_move(event, _this){

        if (!_this.isDragging()) {
            return;
        }
        
        console.log("[move.mousemove]");
        
        const to = _this.pointer.position.value();
        for (const figure of _this.selectedFigures) {
            const position = figure.position.add(to.sub(_this.from));
            figure.position.get(0).set(position.get(0).get());
            figure.position.get(1).set(position.get(1).get());
        }
        _this.from = to;
    }
    mouseup_move(event, _this){
        console.log("[move.mouseup]");
        _this.from = null;
        _this.dragging = false;
    }

    update(){
        this.clear();
        for (const figure of this.figures) {
            if (figure.isVisible()) {
                figure.draw();
            }
        }
    }
    clear() {
        this.context.clearRect(0, 0, 
            this.controll.width, 
            this.controll.height
        );
    }
}