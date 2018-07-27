import Body from './body';
import Vector2D from "../math/vector";
import Constants from "../math/constants";

export default class OrbitingBody extends Body {
    constructor(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent, orbitalParameters) {
        super(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent);
        this.orbitalParameters = orbitalParameters;
        
        this.orbitPrediction = this.calculateOrbitPrediction();
        this.visibleOrbitPredictionPoints = [];
        
        this.position = this.orbitPrediction[0];

        this.lastOffset = new Vector2D();
        this.lastScale = 0.0;
    }

    onRender(context, properties) {
        this.calculateVisibleOrbitPredictionPoints(properties);
        this.renderOrbitPrediction(context, properties);
        super.onRender(context, properties);
    }

    onUpdate(timeStep, totalElapsedTime) {
        super.onUpdate(timeStep, totalElapsedTime);
        const stateVectors = this.getStateVectors(totalElapsedTime);
        this.position = stateVectors.position;
        this.velocity = stateVectors.velocity;
    }

    calculateVisibleOrbitPredictionPoints(properties) {      
        const minBounds = new Vector2D();
        const maxBounds = new Vector2D(properties.viewWidth, properties.viewHeight);
        const parentAbsolutePosition = this.parent.getAbsolutePosition(properties);
        let foundFirstOutOfBoundsPoint = false;
        let lastOutOfBoundsPointIndex = null;

        this.visibleOrbitPredictionPoints = [];
        this.orbitPrediction.forEach((point, index) => {
            point = point.multiply(properties.scale).add(parentAbsolutePosition);
            if(point.x >= minBounds.x && point.x <= maxBounds.x && point.y >= minBounds.y && point.y <= maxBounds.y) {
                this.visibleOrbitPredictionPoints.push(index);

                if(index + 1 == this.orbitPrediction.length) {
                    this.visibleOrbitPredictionPoints.push(0);
                } 
                else if(lastOutOfBoundsPointIndex) {
                    this.visibleOrbitPredictionPoints.push(lastOutOfBoundsPointIndex);
                }

                foundFirstOutOfBoundsPoint = false;
                lastOutOfBoundsPointIndex = null;
            }
            else if(!foundFirstOutOfBoundsPoint && this.visibleOrbitPredictionPoints.length) {
                foundFirstOutOfBoundsPoint = true;
                this.visibleOrbitPredictionPoints.push(index);
            }
            else {
                lastOutOfBoundsPointIndex = index;
            }
        });
    }

    getStateVectors(totalElapsedTime) {
        const e = this.orbitalParameters.eccentricity;
        const a = this.orbitalParameters.semiMajorAxis;
        const M = (this.orbitalParameters.meanAnomaly + 2 * Math.PI * totalElapsedTime / this.orbitalParameters.period) % (2 * Math.PI);

        // Eccentric anomaly
        let E = M;
        while (true)
        {
            let E_next = E - (E - e * Math.sin(E) - M) / (1.0 - e * Math.cos(E));
            let delta = E_next - E;
            E = E_next;
            if(Math.abs(delta) < 1e-8) {
                break;
            }
        }

        // True anomaly
        const halfE = 0.5 * E;
        const v = 2 * Math.atan2(Math.sqrt(1.0 + e) * Math.sin(halfE), Math.sqrt(1.0 - e) * Math.cos(halfE));

        // Distance to central body
        const r = a * (1.0 - e * Math.cos(E));

        // Vectors relative to orbital plane
        const term = Math.sqrt(a * Constants.G * parent.mass) / r;

        return {
            position: new Vector2D(r * Math.cos(v), -r * Math.sin(v)),
            velocity: new Vector2D(term * - Math.sin(E), -term * Math.sqrt(1.0 - e * e) * Math.cos(E))
        };
    }

    calculateOrbitPrediction() {
        this.orbitPrediction = [];
        for (let time = 0.0; time < this.orbitalParameters.period; time += this.orbitalParameters.period / 500) {
            const stateVectors = this.getStateVectors(time);
            this.orbitPrediction.push(stateVectors.position);
        }

        return this.orbitPrediction;
    }

    renderOrbitPrediction(context, properties) {
        const parentAbsolutePosition = this.parent.getAbsolutePosition(properties);

        if(this.visibleOrbitPredictionPoints.length) {      
            context.beginPath();
            context.strokeStyle = properties.defaultStrokeStyle;
            this.visibleOrbitPredictionPoints.forEach((visibleIndex) => {
                if(this.visibleOrbitPredictionPoints.includes((visibleIndex + 1) % this.orbitPrediction.length)) {                   
                    const sourcePoint = this.orbitPrediction[visibleIndex];
                    const targetPoint = this.orbitPrediction[(visibleIndex + 1) % this.orbitPrediction.length];
                    context.moveTo(
                        parentAbsolutePosition.x + sourcePoint.x * properties.scale, 
                        parentAbsolutePosition.y + sourcePoint.y * properties.scale
                    );
                    context.lineTo(parentAbsolutePosition.x + targetPoint.x * properties.scale, parentAbsolutePosition.y + targetPoint.y * properties.scale);
                }
            });
            context.stroke();
            context.closePath();
        }
    }
}