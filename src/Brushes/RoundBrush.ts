import Bitmap from "../types/Bitmap";
import { Color } from "../types/Color";
export class RoundBrush {
    size: number;
    color: Color;

    constructor(
        private bitmap: Bitmap,
        size: number,
        color: Color
    ) {
        this.size = size;
        this.color = color;
    }

    setSize(size: number) {
        this.size = size;
    }

    draw(x: number, y: number): void {
        const radius = this.size / 2;

        const pixels = this.bitmap.pixels;
        const width = this.bitmap.width;
        const height = this.bitmap.height;

        const centerX = Math.round(x);
        const centerY = Math.round(y);

        const minY = Math.max(
            0,
            Math.floor(centerY - radius)
        );

        const maxY = Math.min(
            height - 1,
            Math.ceil(centerY + radius)
        );

        const radiusSquared = radius * radius;

        for (let py = minY; py <= maxY; py++) {

            const dy = py - centerY;

            const horizontalRadius = Math.sqrt(
                radiusSquared - dy * dy
            );

            const minX = Math.max(
                0,
                Math.ceil(centerX - horizontalRadius)
            );

            const maxX = Math.min(
                width - 1,
                Math.floor(centerX + horizontalRadius)
            );

            for (let px = minX; px <= maxX; px++) {

                const index = (py * width + px) * 4;

                pixels[index] = this.color.r;
                pixels[index + 1] = this.color.g;
                pixels[index + 2] = this.color.b;
                pixels[index + 3] = this.color.a;
            }
        }
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Smaller spacing produces a smoother continuous stroke. 
        // const spacing = Math.max(1, this.size * 0.25);
        // const steps = Math.ceil(distance / spacing);
        const steps = Math.ceil(distance);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;

            const x = x1 + dx * t;
            const y = y1 + dy * t;

            this.draw(x, y)
        }
    }
}
