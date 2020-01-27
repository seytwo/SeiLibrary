class Vector {
    constructor(array) {
        this._array = array;
        this.shape = new Shape(this._array.length, 1);

        this.for((i) => {
            if (!(this.get(i) instanceof Scalar)) {
                throw "not Scalar"
            }
        });
    }

    static convert(array) {
        const _array = [];
        for (const value of array) {
            _array.push(new Constant(value));
        }
        return new Vector(_array);
    }

    get array() {
        const array = [];
        this.for((i) => {
            array.push(this.get(i).get());
        });
        return array;
    }
    value() {
        return Vector.convert(this.array);
    }

    for(method) {
        for (let i = 0; i < this.shape.length; i++) {
            method(i);
        }
    }

    get(i) {
        if (i < 0 || this.shape.length <= i) {
            throw "out of index";
        }
        return this._array[i];
    }
    slice(indices) {
        const array = [];
        for (const i of indices) {
            array.push(this.get(i));
        }
        return new Vector(array);
    }

    show() {
        let string = "";
        this.for((i) => {
            string += this.get(i).get();
            if (i != this.shape.length - 1) {
                string += ", ";
            }
        });
        console.log(string);
    }

    opr(other, method) {
        if (!this.shape.isSame(other.shape)) {
            throw "not same shape";
        }

        const array = [];
        this.for((i) => {
            const value = method(
                this.get(i).get(), 
                other.get(i).get()
            );
            array.push(new Constant(value));
        });
        return new Vector(array);
    }
    add(other) {
        return this.opr(other, (x, y) => x + y);
    }
    sub(other) {
        return this.opr(other, (x, y) => x - y);
    }
    mul(other) {
        return this.opr(other, (x, y) => x * y);
    }
    div(other) {
        return this.opr(other, (x, y) => x / y);
    }

    dot(other) {
        if (!this.shape.isSame(other.shape)) {
            throw "not same shape";
        }

        let value = 0;
        this.for((i) => {
            value += this.get(i).get() * other.get(i).get();
        });
        return value;
    }

    get sum() {
        let value = 0;
        this.for((i) => {
            value += this.get(i).get();
        });
        return value;
    }

    unit() {
        const array = [];
        const length = this.length();
        this.for((i) => {
            array.push(this.get(i).get() / length);
        });
        return Vector.convert(array);
    }
    length() {
        let length = 0;
        this.for((i) => {
            length += Math.pow(this.get(i).get(), 2);
        });
        return Math.sqrt(length);
    }

    check(method) {
        let flag = true;
        this.for((i) => {
            flag = flag && method(i);
        });
        return flag;
    }
    isPositive() {
        return this.check((i) => this.get(i).isPositive());
    }
    isNonNegative() {
        return this.check((i) => this.get(i).isNonNegative());
    }
    isZero() {
        return this.check((i) => this.get(i).isZero());
    }
    isEqualTo(other) {
        return this.sub(other).isZero();
    }
}

class Shape {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    get length() {
        return this.row * this.col;
    }
    isSame(other) {
        return this.row == other.row && this.col == other.col;
    }
    isSquare() {
        return this.row == this.col;
    }
    is2x2() {
        return this.row == 2 && this.col == 2;
    }
}