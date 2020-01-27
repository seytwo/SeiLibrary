class Pointer extends Point {
    constructor() {
        super("pointer", new Vector([
            new Variable(() => canvas.pointer.event == null 
                ? 0 : canvas.pointer.event.clientX - canvas.controll.offsetLeft),
            new Variable(() => canvas.pointer.event == null 
                ? 0 : canvas.pointer.event.clientY - canvas.controll.offsetTop)
        ]));
        
        // フラグ
        this.visible = false;
        this.selectable = false;

        // イベント引数
        this._event = null;
    }
}