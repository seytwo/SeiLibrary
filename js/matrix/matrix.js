class Matrix
{
    constructor(array)
    {
        if (!(array instanceof Array))
        {
            throw "array is not Array";
        }

        this._array = array;
        this._shape = new Shape(
            this._array.length,
            this.row(0).shape.length
        );

        // ベクトルか確認
        const col = this.row(0).shape.length;
        this.forrow((i) => 
        {
            let x = this.row(i);
            if (!(this.row(i) instanceof Vector)) 
            {
                throw "not vector"
            }
            if (this.row(i).shape.length != col)
            {
                throw "not shame col shape";
            }
        });
    }

    static convert(arrays)
    {
        return new Matrix(arrays
            .map((array) => Vector.convert(array)));
    }

    get shape()
    {
        return this._shape;
    }   
    
    get(i, j)
    {
        return this.row(i).get(j);
    }
    row(i)
    {
        return this._array[i];
    }
    col(j)
    {
        throw "not implemented";
    }
    rows(indices)
    {
        return new Matrix(indices.map((i) => this.row(i)));
    }
    cols(indices)
    {
        throw "not implemented";
    }

    forrow(method)
    {
        for (let i = 0; i < this.shape.row; i++)
        {
            method(i);
        }
    }
    forcol(method)
    {
        for (let j = 0; j < this.shape.col; j++)
        {
            method(j);
        }
    }
    for(method)
    {
        this.forrow((i) =>
        {
            this.forcol((j) =>
            {
                method(i, j);
            });
        });
    }
    maprow(method)
    {

    }
    map(method)
    {
        throw "not implemented";
    }

    reducerow(method, value)
    {
        return this._array.reduce(method, value);
    }
    reduce(method, value)
    {
        throw "not implemented";
    }

    value()
    {
        throw "not implemented";
    }
    constant()
    {
        throw "not implemented";
    }
    set(matrix)
    {
        if (!(matrix instanceof Matrix))
        {
            throw "matrix is Matrix";
        }
        if (!this.shape.isEqualTo(vector.shape))
        {
            throw "not same shape";
        }

        this.for((i, j) =>
        {
            this.get(i, j).set(matrix.get(i, j));
        });
    }

    get string()
    {
        return this.reducerow((x, y) => x + y.string + "\n", "");
    }
    show()
    {
        console.log(this.string);
    }

    opr(other, method)
    {
        const arrays = [];
        this.forrow((i) =>
        {
            arrays.push(method(this.getrow(i), other.getrow(i)));
        });
        return new Matrix(arrays);
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

    tdot(other)
    {
        const arrays = [];
        this.forrow((i) =>
        {
            const array = [];
            arrays.push(array);
            other.forrow((j) =>
            {
                const scalar = this.row(i).dot(other.row(j));
                array.push(scalar);
            });
        });
        return new Matrix(arrays);
    }
    vdot(other)
    {
        const array = [];
        this.forrow((i) =>
        {
            array.push(this.row(i).dot(other));
        });
        return new Vector(array);
    }

    det() 
    {
        if (!this.shape.isSquare()) 
        {
            throw "not square"
        }
        if (!this.shape.is2x2()) 
        {
            throw "not 2x2"
        }
        return (this.get(0, 0).mul(this.get(1, 1)))
                .sub(this.get(0, 1).mul(this.get(1, 0)));
    }
    
    inv() 
    {
        if (!this.shape.isSquare()) 
        {
            throw "not square"
        }
        if (!this.shape.is2x2()) 
        {
            throw "not 2x2"
        }
        const det = this.det();
        const inv = new Matrix([
            new Vector([ this.get(1, 1).div(det), this.get(0, 1).div(det).negative() ]),
            new Vector([ this.get(1, 0).div(det).negative(), this.get(0, 0).div(det) ])
        ]);
        return inv;
    }
    
    check(method) 
    {
        return this.reducerow((x, y) => x && method(y), true);
    }
    isPositive() 
    {
        return this.check((x) => x.isPositive());
    }
    isNonNegative() 
    {
        return this.check((x) => x.isNonNegative());
    }
    isZero() 
    {
        return this.check((x) => x.isZero());
    }
    isEqualTo(other) 
    {
        return this.sub(other).isZero();
    }
    isSingler()
    {
        return this.det().isZero();
    }
}