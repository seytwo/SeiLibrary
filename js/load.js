let fcontroller = null;
let renderer = null;
let econtroller = null;

function load() 
{
    renderer = new Renderer(2);
    fcontroller = new FigureController();
    econtroller = new EventController();

    //hc = new HyperCube(new Point([100, 100], "point1"), new Point([200, 200], "point2"), "hypercube");

    // point1 = new Point([100, 100], "point1");
    // point2 = new Point([200, 100], "point2");
    // point3 = new Point([200, 200], "point3");
    // point4 = new Point([100, 200], "point3");

    // arrow12 = new Arrow(point1, point2, "arrow12");
    // arrow34 = new Arrow(point3, point4, "arrow23");

    // pf = new Polyhedron([arrow12, arrow34], "polyhedron");
}