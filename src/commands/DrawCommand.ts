import Bitmap from "../types/Bitmap";
import Command from "./Command";

export class DrawCommand implements Command {

    constructor(
        private bitmap: Bitmap,
        private before: Uint8ClampedArray,
        private after: Uint8ClampedArray
    ) { }
    
    execute(): void {
        for (let i = 0; i < this.after.length; i++) {
            this.bitmap.pixels[i] = this.after[i];
        }
    }
    undo(): void {
        for (let i = 0; i < this.before.length; i++) {
            this.bitmap.pixels[i] = this.before[i];
        }
    }

}