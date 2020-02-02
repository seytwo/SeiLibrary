class Polyhedron extends ConvexHull
{
    constructor(arrows, name = "")
    {
        let arrows_ = arrows.slice();
        if (fcontroller.canvas != null)
        {
            arrows_ = arrows_.concat(fcontroller.canvas.arrows);
        }
        //console.log(arrows_);

        let set = getCombination(arrows_, renderer.dimension, 0, [], []);
        const points = set.map((arrows__) => 
            new CrossPoint(arrows__, name + ".crosspoint"));

        super(points, name);

        this._arrows = arrows;

        for (const point of this.points)
        {
            point.visible = false;
        }

        this.center.visible = false;
    }

    get arrows()
    {
        return this._arrows;
    }

    contains(position)
    {
        for (const arrow of this.arrows)
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

        const selecteds = fcontroller.figures.filter((figure) => figure.isSelected());

        if (selecteds.length == 0) 
        {
            econtroller.polyhedron = null;
            return;
        }

        if (econtroller.polyhedron == null) {
            econtroller.polyhedron = new Polyhedron([], "polyhedron");
        }

        console.log("[polyhedron.mousedown]");

        econtroller.polyhedron.points.length = 0;
        for (const point of selecteds.filter((figure) => figure instanceof Arrow)) 
        {
            econtroller.polyhedron.points.push(point);
        }
        
        econtroller.mousedown_select(event);
    }
}

function getCombination(array, m, i, array_, set)
{
    // console.log(i, array_.map((value) => value.id));

    if (array_.length == m)
    {
        console.log(array_.map((value) => value.id));
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