EPSIRON = 0.00001;
class Scalar {

    get() {
        // 抽象メソッド
    }
    set() {
        
    }
    get value() {
        return this.get();
    }

    isPositive() {
        return Scalar.isPositive(this.get());
    }
    isNonNegative() {
        return Scalar.IS_NON_NEGATIVE(this.get());
    }
    isZero() {
        return Scalar.IS_ZERO(this.get());
    }

    static IS_POSITIVE(value) {
        return EPSIRON <= value;
    }
    static IS_NON_NEGATIVE(value) {
        return -EPSIRON <= value;
    }
    static IS_ZERO(value) {
        return !Scalar.IS_POSITIVE(value) && Scalar.IS_NON_NEGATIVE(value);
    }
    static IS_EQUAL_TO(left, right) {
        return Scalar.IS_ZERO(left, right);
    }
}



class Constant extends Scalar {
    constructor(value) {
        super();
        this._value = value;
    }

    get() {
        return this._value;
    }
    set(value) {
        this._value = value;
    }
}

class Variable extends Scalar {
    constructor(f) {
        super();
        this._f = f;
    } 

    get() {
        //console.log(this._f());
        return this._f();
    }

    add(other) {
        throw "not implemented"
    }
    sub(other) {
        throw "not implemented"
    }
    mul(other) {
        throw "not implemented"
    }
    div(other) {
        throw "not implemented"
    }
}