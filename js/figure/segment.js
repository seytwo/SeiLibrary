class Segment extends Hull
{
    constructor(point1, point2, name = "")
    {
        super([point1, point2], name);
    
        // 色
        this.colors[false] = "black";
        this.colors[true] = "rgba(255, 0, 0, 0.5)";
    
        // 頂点
        this._point1 = point1;
        this._point2 = point2;
    }

    get point1()
    {
        return this._point1;
    }
    get point2()
    {
        return this._point2;
    }
}