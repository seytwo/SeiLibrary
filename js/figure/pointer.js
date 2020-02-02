class Pointer extends Point
{
    constructor()
    {
        const position = new Vector(
        [
            new Variable(() => 
                fcontroller.pointer.event == null ? 0 
                : fcontroller.pointer.event.clientX - renderer.controll.offsetLeft),
            new Variable(() =>
                fcontroller.pointer.event == null ? 0 
                : fcontroller.pointer.event.clientY - renderer.controll.offsetTop)
        ]);
        
        super(position, "pointer");
        this.visible = false;
        this.selectable = false;

        this._event = null;
    }

    get event()
    {
        return this._event;
    }
    set event(value)
    {
        if (value.clientX == undefined) 
        {
            return;
        }
        this._event = value;
    }
}