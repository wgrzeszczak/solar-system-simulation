import Body from './body';

export default class Star extends Body {
    constructor(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent) {
        super(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent);
    }

    onRender(context, properties) {
        super.onRender(context, properties);
    }

    onUpdate(timeStep, totalElapsedTime) {
        super.onUpdate(timeStep, totalElapsedTime);
    }
}