class Polyhedron extends Figure {
    constructor(name, halfspaces) {
        super(name);
        this.color = "rgba(255, 0, 0, 0.5)";
        this._halfspaces = halfspaces;
    }

    draw(){
    }

    get halfspaces() {
        return this._halfspaces;
    }

    reset() {
        this.halfspaces.length = 0;
    }

    static initializeEventHandler() {
        canvas.addEventHandler(canvas, "mousedown", Polyhedron.mousedown);
    }
    static mousedown(event, _this) {
        console.log("[mousedown_polyhedron]");

        if (!_this.keys.has("d") && !_this.keys.has("D")) {
            _this.polyhedron = null;
            return;
        }

        if (_this.polyhedron == null) {
            _this.polyhedron = new Polyhedron("polyhedron", []);
        }

        _this.polyhedron.reset();
        for (const figure of _this.selectedFigures) {
            if (figure instanceof HalfSpace) {
                _this.polyhedron.halfspaces.push(figure);
            }
        }
    }
}
