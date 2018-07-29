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
        super.onUpdate(timeStep, properties);
        this.calculateOrbitPrediction(properties);
        const stateVectors = this.getStateVectors(properties);
        this.position = stateVectors.position;
    }

    getJulianDay(date) {
        return date.getTime() / 86400000 + 2440587.5 - 2451543.5; //julian day from 1970 + days to 1970 - days to epoch J2000
    }

    getStateVectors(properties) {
        const date = new Date(properties.totalElapsedTime);
        const day = this.getJulianDay(date);
        const T = day / 36525;

        let a = this.orbitalParameters.a0 + this.orbitalParameters.ac * T;
        let e = this.orbitalParameters.e0 + this.orbitalParameters.ec * T;
        let I = this.orbitalParameters.I0 + this.orbitalParameters.Ic * T;
        let L = this.orbitalParameters.L0 + this.orbitalParameters.Lc * T;
        let Lp = this.orbitalParameters.Lp0 + this.orbitalParameters.Lpc * T;
        let o = this.orbitalParameters.o0 + this.orbitalParameters.oc * T;

        let M = ((L - Lp) % 360) * Math.PI / 180;
        let wp = (Lp - o) * Math.PI / 180;
        
        I = I * Math.PI / 180;
        L = L * Math.PI / 180;
        Lp = Lp * Math.PI / 180;
        o = o * Math.PI / 180;

        let E = M;      
        while(true) {
            const ENext = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
            const dE = E - ENext;
            E = ENext;
            if(Math.abs(dE) < 10e-6) {
                break;
            }
        }
        
        M %= (2 * Math.PI);
        M %= (2 * Math.PI);
        I %= (2 * Math.PI);
        L %= (2 * Math.PI);
        Lp %= (2 * Math.PI);
        M %= (2 * Math.PI);
        wp %= (2 * Math.PI);

        const xp = a * (Math.cos(E) - e);
        const yp = a * Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E);

        const x = xp * (Math.cos(wp) * Math.cos(o) - Math.sin(wp) * Math.sin(o) * Math.cos(I)) + yp * (-Math.sin(wp) * Math.cos(o) - Math.cos(wp) * Math.sin(o) * Math.cos(I));
        const y = xp * (Math.cos(wp) * Math.sin(o) + Math.sin(wp) * Math.cos(o) * Math.cos(I)) + yp * (-Math.sin(wp) * Math.sin(o) + Math.cos(wp) * Math.cos(o) * Math.cos(I));

        return {
            position: new Vector2D(x, -y),
        };
    }

    calculateOrbitPrediction(properties) {
        this.orbitPrediction = [];
        const date = new Date(properties.totalElapsedTime);
        const day = this.getJulianDay(date);
        const T = day / 36525;
        const a = this.orbitalParameters.a0 + this.orbitalParameters.ac * T;
        const period = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (properties.G * this.parent.mass)) * 1000; // in ms

        for (let timeStep = 0.0; timeStep < period; timeStep += period / 500) {
            const stateVectors = this.getStateVectors({
                totalElapsedTime: properties.totalElapsedTime + timeStep
            });
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