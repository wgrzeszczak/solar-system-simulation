import Vector2D from '../math/vector';
import BodyBuilder from './bodyBuilder';
import OrbitingBody from '../objects/orbitingBody';

export default class OrbitingBodyBuilder extends BodyBuilder {
    constructor(document) {
        super(document);
        this.orbitPrediction = {
            eccentricity: 0,
            semiMajorAxis: 0,
            meanAnomaly: 0,
            period: 0
        }
    }

    withOrbitalParameters(orbitalParameters) {
        this.orbitalParameters = orbitalParameters;
        return this;
    }

    build() {
        return new OrbitingBody(
            this.label, this.image, this.document.createElement('canvas'), this.mass, 
            this.radius, this.positon, this.velocity, this.rotation,
            this.angularVelocity, this.parent, this.orbitalParameters
        );
    }
}