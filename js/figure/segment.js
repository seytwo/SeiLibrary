class Segment extends Hull
{
    constructor(point1, point2, name = "")
    {
        super([point1, point2], name);
    
        //
        this.selectable = true;
        
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

    getLeg(position)
    {
        throw "not implemented";
    }
    contains(position)
    {
        const positionx = position.constant()
        const position1 = this.point1.position.constant();
        const position2 = this.point2.position.constant();

        const direction12 = position2.sub(position1);
        const direction1x = positionx.sub(position1);

        const k = (direction1x.dot(direction12)).div(direction12.dot(direction12));
        const l = direction1x.length();
        const m = direction12.length().mul(k);
        const n = l.square().sub(m.square()).sqrt();

        return 0.1 <= k.value() && k.value() <= 0.9 && n.value() <= 5;
    }
}