import Background from '../objects/background';

export default class BackgroundBuilder {
    constructor(document) {
        this.document = document;
        this.image = null;
    }

    withImage(image) {
        this.image = image;
        return this;
    }

    build() {
        return new Background(this.image, this.document.createElement('canvas'));
    }
}