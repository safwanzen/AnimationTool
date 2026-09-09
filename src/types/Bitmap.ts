// RGBA format, based on ImageData.data
export default class Bitmap {
    readonly width: number;
    readonly height: number;
    readonly pixels: Uint8ClampedArray;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8ClampedArray(width * height * 4);
        // 4 bytes for RGBA
    }

    setPixel(
        x: number,
        y: number,
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const i = (y * this.width + x) * 4;
        this.pixels[i] = r;
        this.pixels[i + 1] = g;
        this.pixels[i + 2] = b;
        this.pixels[i + 3] = a;
    }

    clear() {
        for (let i = 0; i < this.pixels.byteLength; i++) {
            this.pixels[i] = 0;
        }
    }
}