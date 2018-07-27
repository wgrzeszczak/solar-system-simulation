import Vector2D from "../math/vector";

export default class Body {
    constructor(label, image, imageCanvas, mass, radius, position, velocity, rotation, angularVelocity, parent) {
        this.label = label;
        this.imageCanvas = imageCanvas;
        this.imageCanvasContext = this.imageCanvas.getContext('2d');
        this.image = this.prepareImage(image);
        this.mass = mass;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.angularVelocity = angularVelocity;
        this.parent = parent;
    }

    onRender(context, properties) {
        if(this.isBodyVisible(properties)) {
            this.renderImage(context, properties);
            this.renderArc(context, properties);
            this.renderLabel(context, properties);
        }
    }

    onUpdate(timeStep, totalElapsedTime) {
        this.position = new Vector2D(this.position.x + this.velocity.x * timeStep, this.position.y + this.velocity.y * timeStep);
        this.rotation = (this.rotation + this.angularVelocity * timeStep) % 360;
    }

    isBodyVisible(properties) {
        const minBounds = new Vector2D();
        const maxBounds = new Vector2D(properties.viewWidth, properties.viewHeight);
        const position = this.getAbsolutePosition(properties);
        const radius = this.radius * properties.scale;
        if(position.x + radius < minBounds.x || position.x - radius > maxBounds.x || position.y + radius < minBounds.y || position.y - radius > maxBounds.y) {
            return false;
        }
        return true;
    }

    prepareImage(imageSource) {
        const image = new Image();
        image.src = imageSource;
        image.addEventListener('load', () => {
            this.imageCanvas.width = image.width;
            this.imageCanvas.height = image.height;
        });

        return image;
    }

    getAbsolutePosition(properties) {
        let absolutePosition = null;
        if(this.parent) {
            const parentAbsolutePosition = this.parent.getAbsolutePosition(properties);
            absolutePosition = parentAbsolutePosition.add(this.position.multiply(properties.scale));
        }
        else {
            absolutePosition = this.position.add(properties.offset).multiply(properties.scale);
        }

        return new Vector2D(Math.floor(absolutePosition.x), Math.floor(absolutePosition.y));
    }

    renderArc(context, properties) {
        const absolutePosition = this.getAbsolutePosition(properties);
        context.beginPath();
        context.fillStyle = properties.defaultFillStyle;
        context.strokeStyle = properties.defaultStrokeStyle;
        context.arc(
            absolutePosition.x,
            absolutePosition.y,
            5, 0, 2 * Math.PI
        );
        context.stroke();
        context.fill();
        context.closePath();
    }

    renderImage(context, properties) {
        const absolutePosition = this.getAbsolutePosition(properties);

        this.imageCanvasContext.save();
        this.imageCanvasContext.translate(this.imageCanvas.width / 2, this.imageCanvas.height / 2);
        this.imageCanvasContext.rotate(this.rotation * Math.PI / 180);
        this.imageCanvasContext.drawImage(this.image, Math.floor(-this.imageCanvas.width / 2), Math.floor(-this.imageCanvas.height / 2));
        this.imageCanvasContext.restore();

        const scaledRadius = Math.floor(this.radius * properties.scale);
        context.drawImage(
            this.imageCanvas,
            absolutePosition.x - scaledRadius,
            absolutePosition.y - scaledRadius,
            2 * scaledRadius,
            2 * scaledRadius
        );
    }

    renderLabel(context, properties) {
        const absolutePosition = this.getAbsolutePosition(properties);
        const startTextPointOffset = new Vector2D(20, -25);
        const endTextPointOffset = new Vector2D(100, -25);
        context.beginPath();
        context.fillStyle = properties.defaultFillStyle;
        context.strokeStyle = properties.defaultStrokeStyle;

        context.moveTo(absolutePosition.x, absolutePosition.y);
        context.lineTo(absolutePosition.x + startTextPointOffset.x, absolutePosition.y + startTextPointOffset.y);
        context.lineTo(absolutePosition.x + endTextPointOffset.x, absolutePosition.y + endTextPointOffset.y)

        context.font = properties.defaultFontStyle;
        context.fillText(
            this.label, 
            Math.floor(absolutePosition.x + startTextPointOffset.x * 1.5), 
            Math.floor(absolutePosition.y + startTextPointOffset.y / 3.0)
        );

        context.stroke();
        context.closePath();
    }
}