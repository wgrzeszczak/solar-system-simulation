export default class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    multiply(constant) {
        return new Vector2D(this.x * constant, this.y * constant);
    }

    divide(constant) {
        return new Vector2D(this.x / constant, this.y / constant);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }
}