class Matrix {
    constructor(array) {
        this._array = array;
        this.shape = new Shape(
            this._array.length, 
            this._array[0].shape.length
        );

        this.forrow((i) => {
            let x = this.row(i);
            if (!(this.row(i) instanceof Vector)) {
                throw "not vector"
            }
        });
    }

    static convert(arrays) {
        const vectors = [];
        for (const array of arrays) {
            vectors.push(Vector.convert(array));
        }
        return new Matrix(vectors);
    }

    forrow(method) {
        for (let i = 0; i < this.shape.row; i++) {
            method(i);
        }
    }
    forcol(method) {
        for (let j = 0; j < this.shape.col; j++) {
            method(j);
        }
    }
    for(method) {
        this.forrow((i) => {
            this.forcol((j) => {
                method(i, j);
            });
        });
    }

    get(i, j) {
        return this.row(i).get(j);
    }

    row(i) {
        if (i < 0 || this.shape.row <= i) {
            throw "out of index";
        }
        return this._array[i];
    }
    rows(indices) {
        const array = [];
        for (const i of indices) {
            array.push(this.row(i));
        }
        return new Matrix(array);
    }

    col(j) {
        if (j < 0 || this.shape.col <= j) {
            throw "out of index";
        }
        throw "not implemented"
    }
    cols(indices) {
        throw "not implemented"
    }

    show() {
        this.forrow((i) => {
            this.row(i).show();
        });
    }

    opr(other, method) {
        if (!this.shape.isSame(other.shape)) {
            throw "not same shape";
        }

        const vectors = [];
        this.forrow((i) => {
            const vector = method(this.row(i), other.row(i));
            vectors.push(vector);
        });
        return new Matrix(vectors);
    }
    add(other) {
        return this.opr(other, (x, y) => x.add(y));
    }
    sub(other) {
        return this.opr(other, (x, y) => x.sub(y));
    }
    mul(other) {
        return this.opr(other, (x, y) => x.mul(y));
    }
    div(other) {
        return this.opr(other, (x, y) => x.div(y));
    }

    tdot(other) {
        const arrays = [];
        this.forrow((i) => {
            const array = [];
            arrays.push(array);
            this.forcol((j) => {
                const value = this.row(i).dot(other.row(j));
                array.push(value);
            });
        });
        return Matrix.convert(arrays);
    }

    get det() {
        if (!this.shape.isSquare()) {
            throw "not square"
        }
        if (!this.shape.is2x2()) {
            throw "not 2x2"
        }
        return this.get(0, 0).get() * this.get(1, 0).get() 
            - this.get(0, 1).get() * this.get(1, 0).get();
    }

    get inv() {
        const det = this.det;
        return Matrix.convert([
            [ this.get(1, 1).get() / det, -this.get(0, 1) / det ],
            [ -this.get(1, 0).get() / det, this.get(0, 0) / det ]
        ]);
        throw "not implemented"
    }

    get t() {
        throw "not implemented"
    }

    get sum() {
        let value = 0;
        this.forrow((i) => {
            value += this.row()
        });
        return value;
    }

    check(method) {
        let flag = true;
        this.forrow((i) => {
            flag = flag && method(i);
        });
        return flag;
    }
    isPositive() {
        return this.check((i) => this.row(i).isPositive());
    }
    isNonNegative() {
        return this.check((i) => this.row(i).isNonNegative());
    }
    isZero() {
        return this.check((i) => this.row(i).isZero());
    }
    isEqualTo(other) {
        return this.sub(other).isZero();
    }
}