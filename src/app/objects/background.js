export default class Background {
    constructor(image, imageCanvas) {
        this.image = new Image();
        this.image.src = image;
        this.imageCanvas = imageCanvas;
        this.imageCanvasContext = this.imageCanvas.getContext('2d');

        this.image.addEventListener('load', () => {
            this.imageCanvas.width = this.image.width;
            this.imageCanvas.height = this.image.height;
            this.imageCanvasContext.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        });
    }

    onRender(context, properties) {
        context.drawImage(this.imageCanvas, 0, 0, properties.viewWidth, properties.viewHeight);
    }
}