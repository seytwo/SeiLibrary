class Line extends Figure {
    constructor(name, arrow) {
        super(name);

        this.arrow = arrow;

        this.draw();
    }

    draw() {
        const points = [];

        const point = this.arrow.point1;
        const direction = this.arrow.getVector();

        for (const x of [ 0, canvas.controll.width ]) {
            const y = point.position[1] - direction[0] / direction[1] * (x - point.position[0]);

            if (0 <= y && y <= canvas.controll.height) {
                const point = [ x, y ];
                points.push(point);
            }
        }

        for (const y of [ 0, canvas.controll.height ]) {
            const x = point.position[0] - direction[1] / direction[0] * (y - point.position[1]);

            if (0 <= x && x <= canvas.controll.width) {
                const point = [ x, y ];
                points.push(point);
            }
        }

        if (points.length != 2) {
            console.log("***");
        }

        canvas.context.beginPath();
        canvas.context.moveTo(points[0][0], points[0][1]);
        canvas.context.lineTo(points[1][0], points[1][1]);
        
        canvas.context.strokeStyle = this.color;
        canvas.context.stroke();
    }
}
