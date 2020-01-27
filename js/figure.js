let _count = 0;
class Figure extends Base {
    constructor(name, position) {
        super(_count, name, position);
        _count++;

        // キャンバスに追加
        canvas.addFigure(this);

        // 描画色：{ selected : color }
        this.colors = {
            false : "black",
            true : "rgba(255, 0, 0, 0.5)"
        };
        
        // イベントハンドラ
        this.initializeEventHandler();
    }

    // イベントハンドラ
    initializeEventHandler(){
        canvas.addEventHandler(this, "mousemove", (event, _this) => {
            _this.eventHandler(event);
        });
        canvas.addEventHandler(this, "mousedown", (event, _this) => {
            _this.eventHandler(event);
        });
        canvas.addEventHandler(this, "mouseup", (event, _this) => {
            _this.eventHandler(event);
        });
        canvas.addEventHandler(this, "keydown", (event, _this) => {
            _this.eventHandler(event);
        });
        canvas.addEventHandler(this, "keyup", (event, _this) => {
            _this.eventHandler(event);
        });
    }
    eventHandler(event) {
        for (const id in this.eventHandlers[event.type]) {
            this.eventHandlers[event.type][id](event);
        }
    }
    
    draw() {
        // 抽象メソッド
    }
}