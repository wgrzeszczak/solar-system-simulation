import Body from './body';
import Vector2D from "../math/vector";

export default class OrbitingBody extends Body {
    constructor(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent, orbitalParameters) {
        super(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent);
        this.orbitalParameters = orbitalParameters;
        
        this.orbitPrediction = [];
        this.visibleOrbitPredictionPoints = [];
        this.lastOffset = new Vector2D();
        this.lastScale = 0.0;
    }

    onRender(context, properties) {
        this.calculateVisibleOrbitPredictionPoints(properties);
        this.renderOrbitPrediction(context, properties);
        super.onRender(context, properties);
    }

    onUpdate(timeStep, properties) {
        if(!this.orbitPrediction.length) {
            this.calculateOrbitPrediction(properties);               
            this.position = this.orbitPrediction[0];
        }

        super.onUpdate(timeStep, properties);
        const stateVectors = this.getStateVectors(properties);
        this.position = stateVectors.position;
        this.velocity = stateVectors.velocity;
    }

    getStateVectors(properties) {
        const e = this.orbitalParameters.eccentricity; // <0, 1)
        const a = this.orbitalParameters.semiMajorAxis * 1000.0; // in meters
        const M = (this.orbitalParameters.meanAnomaly * Math.PI / 180 + 2 * Math.PI * properties.totalElapsedTime / this.orbitalParameters.period) % (2 * Math.PI); // in radians

        // Eccentric anomaly
        let E = M;
        while (true)
        {
            let E_next = E - (E - e * Math.sin(E) - M) / (1.0 - e * Math.cos(E));
            let delta = E_next - E;
            E = E_next;
            if(Math.abs(delta) < 1e-6) {
                break;
            }
        }

        // True anomaly
        const halfE = 0.5 * E;
        const v = 2 * Math.atan2(Math.sqrt(1.0 + e) * Math.sin(halfE), Math.sqrt(1.0 - e) * Math.cos(halfE));

        // Distance to central body
        const r = a * (1.0 - e * Math.cos(E));

        // Vectors relative to orbital plane
        const term = Math.sqrt(a * properties.G * parent.mass) / r;

        return {
            position: new Vector2D(r * Math.cos(v), -r * Math.sin(v)),
            velocity: new Vector2D(term * - Math.sin(E), -term * Math.sqrt(1.0 - e * e) * Math.cos(E))
        };
    }

    calculateOrbitPrediction(properties) {
        this.orbitPrediction = [];
        for (let timeStep = 0.0; timeStep < this.orbitalParameters.period; timeStep += this.orbitalParameters.period / 500) {
            Object.assign(properties, {
                totalElapsedTime: timeStep
            });
            const stateVectors = this.getStateVectors(properties);
            this.orbitPrediction.push(stateVectors.position);
        }
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

    renderOrbitPrediction(context, properties) {
        if(this.visibleOrbitPredictionPoints.length) {      
            const parentAbsolutePosition = this.parent.getAbsolutePosition(properties);

            context.beginPath();
            context.strokeStyle = properties.defaultStrokeStyle;
            this.visibleOrbitPredictionPoints.forEach((visibleIndex) => {
                const followingIndex = (visibleIndex + 1) % this.orbitPrediction.length;
                if(this.visibleOrbitPredictionPoints.includes(followingIndex)) {                   
                    const sourcePoint = this.orbitPrediction[visibleIndex];
                    const targetPoint = this.orbitPrediction[followingIndex];
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