import Vector2D from '../math/vector';
import Body from '../objects/body'

export default class BodyBuilder {
    constructor(document) {
        this.document = document;

        this.label = 'Unknown';
        this.image = null;
        this.mass = 0.0;
        this.radius = 0.0;
        this.positon = new Vector2D();
        this.velocity = new Vector2D();
        this.rotation = 0.0;
        this.angularVelocity = 0.0;
        this.parent = null;
    }

    withLabel(label) {
        this.label = label;
        return this;
    }

    withImage(image) {
        this.image = image;
        return this;
    }

    withMass(mass) {
        this.mass = mass;
        return this;
    }

    withRadius(radius) {
        this.radius = radius;
        return this;
    }

    withAngularVelocity(angularVelocity) {
        this.angularVelocity = angularVelocity;
        return this;
    }

    withParent(parent) {
        this.parent = parent;
        return this;
    }

    withPosition(position) {
        this.positon = position;
        return this;
    }

    build() {
        return new Body(
            this.label, this.image, this.document.createElement('canvas'), this.mass, 
            this.radius, this.positon, this.velocity, this.rotation, 
            this.angularVelocity
        );
    }
}