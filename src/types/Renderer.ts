import Bitmap from "./Bitmap";

export default class Renderer {
    imageData: ImageData;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private bitmap: Bitmap
    ) {
        this.imageData = new ImageData(
            this.bitmap.width,
            this.bitmap.height
        );
    }

    render(): void {
        this.imageData.data.set(this.bitmap.pixels);
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}