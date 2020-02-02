class Variable extends Scalar
{
    constructor(f)
    {
        super();
        if (typeof f != "function")
        {
            throw "f is not Function";
        }
        this._f = f;
    }

    get f()
    {
        return this._f;
    }

    value()
    {
        return this.f();
    }
    set() 
    { 
        
    }
    constant()
    {
        return new Constant(this.value());
    }
}