class Constant extends Scalar
{
    constructor(value) 
    {
        super();
        this.set(value);
    }

    value()
    {
        return this._value;
    }
    set(value)
    {
        if (!Number.isFinite(value))
        {
            throw "value is not Number";
        }
        this._value = value;
    }
    constant()
    {
        return this;
    }
}