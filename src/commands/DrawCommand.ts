import Bitmap from "../types/Bitmap";
import Command from "./Command";

export class DrawCommand implements Command {

    constructor(
        private bitmap: Bitmap,
        private before: Uint8ClampedArray,
        private after: Uint8ClampedArray
    ) { }
    
    execute(): void {
        //this.bitmap.pixels = this.before;
    }
    undo(): void {
        //this.bitmap.pixels = this.after;
    }

}