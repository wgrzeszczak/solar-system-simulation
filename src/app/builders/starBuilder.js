import Vector2D from '../math/vector';
import BodyBuilder from './bodyBuilder';
import Star from '../objects/star';

export default class StarBuilder extends BodyBuilder {
    constructor(document) {
        super(document);
    }

    build() {
        return new Star(
            this.label, this.image, this.document.createElement('canvas'), this.mass, 
            this.radius, this.positon, this.velocity, this.rotation,
            this.angularVelocity, this.parent, 
        );
    }
}