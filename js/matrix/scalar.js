EPSIRON = 0.00001;
class Scalar
{
    value()
    {
        throw "not implemented";
    }
    set(value)
    {
        throw "not implemented";
    }

    isError()
    {
        return !Number.isFinite(this.value());
    }

    opr(other, method) 
    {
        const left = this.value();
        const right = other.value();
        return new Constant(method(left, right));
    }
    add(other)
    {
        return this.opr(other, (x, y) => x + y);
    }
    sub(other) 
    {
        return this.opr(other, (x, y) => x - y);
    }
    mul(other) 
    {
        return this.opr(other, (x, y) => x * y);
    }
    div(other) 
    {
        return this.opr(other, (x, y) => x / y);
    }

    pow(count)
    {
        let scalar = new Constant(1);
        for (let i = 0; i < count; i++)
        {
            scalar = scalar.mul(this);
        }
        return scalar;
    }
    sqrt()
    {
        return new Constant(Math.sqrt(this.value()));
    }
    negative()
    {
        return new Constant(-this.value());
    }

    isPositive() 
    {
        return Scalar.isPositive(this.value());
    }
    isNonNegative() 
    {
        return Scalar.IS_NON_NEGATIVE(this.value());
    }
    isZero() 
    {
        return Scalar.IS_ZERO(this.value());
    }
    isEqualTo(other)
    {
        return Scalar.IS_EQUAL_TO(this.value(), other.value())
    }

    static IS_POSITIVE(value) 
    {
        return EPSIRON <= value;
    }
    static IS_NON_NEGATIVE(value) 
    {
        return -EPSIRON <= value;
    }
    static IS_ZERO(value) 
    {
        return !Scalar.IS_POSITIVE(value) 
            && Scalar.IS_NON_NEGATIVE(value);
    }
    static IS_EQUAL_TO(left, right) 
    {
        return Scalar.IS_ZERO(left, right);
    }
}