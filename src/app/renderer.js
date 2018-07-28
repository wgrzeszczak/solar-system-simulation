import Vector2D from "./math/vector";

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.imageSmoothingEnabled = true;

        this.scrollStep = 0.2;
        this.minScroll = 1e-1,
        this.maxScroll = 1e-10;

        this.width = 0;
        this.height = 0;
        this.scale = 1e-6;
        this.moveStep = 1.0;

        this.offset = new Vector2D();
        
        this.defaultFillStyle = 'white';
        this.defaultStrokeStyle = 'white';
        this.defaultFontStyle = '18px Calibri';
        this.objectColor = '#f78300';
        
        this.renderables = [];
    }

    addRenderable(renderable) {
        this.renderables.push(renderable);
    }

    render() {
        const properties = {
            viewWidth: this.width,
            viewHeight: this.height,
            scale: this.scale,
            offset: this.offset,
            defaultFillStyle: this.defaultFillStyle,
            defaultStrokeStyle: this.defaultStrokeStyle,
            defaultFontStyle: this.defaultFontStyle,
            objectColor: this.objectColor
        };

        this.renderables.forEach((renderable) => {
            renderable.onRender(this.context, properties);
        });
    }

    onResize(width, height) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
    }

    onChangeScale(direction, mousePosition) {
        const currentPosition = new Vector2D(mousePosition.x / this.scale - this.offset.x, mousePosition.y / this.scale - this.offset.y);
        this.scale = Math.min(this.minScroll, Math.max(this.maxScroll, this.scrollStep * this.scale * direction + this.scale));
        const newPosition = new Vector2D(mousePosition.x / this.scale - this.offset.x, mousePosition.y / this.scale - this.offset.y);
        this.offset = this.offset.add(newPosition.subtract(currentPosition));
    }

    onMove(offset) {
        this.offset = this.offset.add(offset.multiply(this.moveStep / this.scale));
    }
}