class Polyhedron extends ConvexHull
{
    constructor(arrows, name = "")
    {
        // let arrows_ = arrows.slice();
        // if (fcontroller.canvas != null)
        // {
        //     arrows_ = arrows_.concat(fcontroller.canvas._arrows);
        // }

        // let set = getCombination(arrows_, renderer.dimension, 0, [], []);
        // const points = set.map((arrows__) => 
        //     new CrossPoint(arrows__, name + ".crosspoint"));

        super([], name);

        // 矢印の集合
        this.reset();
        if (fcontroller.canvas != null)
        {
            for (const point of fcontroller.canvas.points)
            {  
                this.points.push(point);
            }
        }
        for (const arrow of arrows)
        {
            this.add(arrow);
        }

        // 交点を描写しない
        for (const point of this.points)
        {
            point.visible = false;
        }

        this.center.visible = false;
    }

    add(arrow)
    {
        if (this._arrowSet.has(arrow.id))
        {
            return;
        }

        // キャンバスの矢印を追加
        let arrows_ = this._arrows.slice();
        if (fcontroller.canvas != null)
        {
            arrows_ = arrows_.concat(fcontroller.canvas._arrows);
        }
        const set = getCombination(arrows_, renderer.dimension - 1, 0, [], []);

        for (const arrows__ of set)
        {
            arrows__.push(arrow);
        }

        const points = set.map((arrows__) => new CrossPoint(arrows__, this.name + ".crosspoint"));
        for (const point of points)
        {
            this.points.push(point);
            point.visible = false;
        }

        this._arrows.push(arrow);
        this._arrowSet.add(arrow.id);
    }
    reset()
    {
        this._arrows = [];
        this._arrowSet = new Set();
    }

    contains(position)
    {
        for (const arrow of this._arrows)
        {
            if (!arrow.direction.dot(position.sub(arrow.from.position)).isNonNegative())
            {
                return false;
            }
        }
        return true;
    }

    static mousedown(event) 
    {
        if (!econtroller.keys.has("x") && !econtroller.keys.has("X")) 
        {
            econtroller.polyhedron = null;
            return;
        }

        const selecteds = fcontroller.getSelectedFigures();

        if (selecteds.length == 0) 
        {
            econtroller.polyhedron = null;
            return;
        }

        if (econtroller.polyhedron == null) {
            econtroller.polyhedron = new Polyhedron([], "polyhedron");
        }

        console.log("[polyhedron.mousedown]");

        for (const arrow of selecteds.filter((figure) => figure instanceof Arrow)) 
        {
            econtroller.polyhedron.add(arrow);
        }
    }
}

function getCombination(array, m, i, array_, set)
{
    // console.log(i, array_.map((value) => value.id));

    if (array_.length == m)
    {
        set.push(array_.slice());
        return set;
    }

    if (i == array.length)
    {
        return set;
    }

    const array__ = array_.slice();
    array__.push(array[i])
    getCombination(array, m, i + 1, array__, set);
    
    getCombination(array, m, i + 1, array_, set);

    return set;
}