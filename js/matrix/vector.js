class Vector 
{
    constructor(array)
    {
        if (!(array instanceof Array))
        {
            throw "array is not Array";
        }
        
        this._array = array;
        this._shape = new Shape(this._array.length, 1);

        if (!this.check((x) => x instanceof Scalar)) 
        {
            throw "this[i] is not Scalar";
        }
    }

    static convert(array)
    {
        return new Vector(array.map((value) => new Constant(value)));
    }

    get shape()
    {
        return this._shape;
    }

    get(i) 
    {
        if (i < 0 || this.shape.length <= i) 
        {
            throw "out of index";
        }
        return this._array[i];
    }
    slice(indices) 
    {
        return new Vector(indices.map((i) => this.get(i)));
    }
    
    for(method)
    {
        for (let i = 0; i < this.shape.length; i++) 
        {
            method(i);
        }
    }
    map(method)
    {
        return new Vector(this._array.map(method));
    }
    reduce(method, scalar)
    {
        return this._array.reduce(method, scalar);
    }

    value() 
    {
        return this._array.map((x) => x.value());
    }
    constant()
    {
        return this.map((x) => x.constant());
    }
    const()
    {
        return this.constant();
    }
    set(vector)
    {
        if (!(vector instanceof Vector))
        {
            throw "vector is Vector";
        }
        if (!this.shape.isEqualTo(vector.shape))
        {
            throw "not same shape";
        }

        this.for((i) =>
        {
            this.get(i).set(vector.get(i).value());
        });
    }
    
    get string()
    {
        return this.reduce((x, y) => x + y.value() + ", ", "");
    }
    show() 
    {
        console.log(this.string);
    }

    opr(other, method) 
    {
        if (!(other instanceof Vector)) 
        {
            throw "other is not Vector";
        }
        if (!this.shape.isEqualTo(other.shape)) 
        {
            throw "not same shape";
        }

        const array = [];
        this.for((i) => {
            array.push(method(this.get(i), other.get(i)));
        });
        return new Vector(array);
    }
    add(other)
    {
        return this.opr(other, (x, y) => x.add(y));
    }
    sub(other) 
    {
        return this.opr(other, (x, y) => x.sub(y));
    }
    mul(other) 
    {
        return this.opr(other, (x, y) => x.mul(y));
    }
    div(other) 
    {
        return this.opr(other, (x, y) => x.div(y));
    }

    dot(other)
    {
        if (!this.shape.isEqualTo(other.shape)) {
            throw "not same shape";
        }

        let scalar = new Constant(0);
        this.for((i) =>
        {
            scalar = scalar.add(this.get(i).mul(other.get(i)));
        });
        return scalar;
    }

    unit()
    {
        const length = this.length();
        return this.map((x) => x.div(length));
    }

    sum()
    {
        return this.reduce((x, y) => x.add(y), new Constant(0));
    }
    length()
    {
        return this.reduce((x, y) => x.add(y.square()), new Constant(0)).sqrt();
    }
    
    check(method) {
        return this.reduce((x, y) => x && method(y), true);
    }
    isPositive() {
        return this.check((x) => x.isPositive());
    }
    isNonNegative() {
        return this.check((x) => x.isNonNegative());
    }
    isZero() {
        return this.check((x) => x.isZero());
    }
    isEqualTo(other) {
        return this.sub(other).isZero();
    }
}

class Shape 
{
    constructor(row, col) 
    {
        this._row = row;
        this._col = col;
    }

    get row()
    {
        return this._row;
    }
    get col()
    {
        return this._col;
    }
    get length() {
        return this.row * this.col;
    }

    isEqualTo(other) 
    {
        return this.row == other.row 
            && this.col == other.col;
    }
    isSquare() 
    {
        return this.row == this.col;
    }
    is2x2() 
    {
        return this.row == 2 && this.col == 2;
    }
}