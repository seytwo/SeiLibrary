class LCP
{
    constructor(polyhedrons, name = "")
    {
        this.polyhedrons = polyhedrons;

        const arrows = this.polyhedrons.reduce((x, y) => x.concat(y._arrows), []);
        this.polyhedron = new Polyhedron(arrows, name + ".polyhedron");
        this.polyhedron.colors[false] = this.polyhedron.colors[true];
    }
}