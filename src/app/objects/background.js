export default class Background {
    constructor(image) {
        this.image = new Image();
        this.image.src = image;
    }

    onUpdate(timeStep, totalElapsedTime) {
        
    }

    onRender(context, properties) {
        context.clearRect(0, 0, properties.viewWidth, properties.viewHeight);
        context.drawImage(this.image, 0, 0, properties.viewWidth, properties.viewHeight);
    }
}