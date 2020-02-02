class CrossPoint extends Point
{
    constructor(arrows, name = "")
    {
        if (arrows.length != renderer.dimension)
        {
            throw "number of arrows is not equal to dimension";
        }

        const A = new Matrix(arrows.map((arrow) => arrow.direction));
        const b = new Vector(arrows.map((arrow) => 
            new Variable(() => arrow.direction.dot(arrow.from.position).value())));
        const x = new Vector([
            new Variable(() => {
                if (A.det().isZero()) 
                {
                    return true;
                }
                return A.inv().row(0).dot(b).value();
            }),
            new Variable(() => {
                if (A.det().isZero()) 
                {
                    return true;
                }
                return A.inv().row(1).dot(b).value();
            })
        ]);

        super(x, name);

        this.arrows = arrows;

        this.A = A;
        this.b = b;
    }
}