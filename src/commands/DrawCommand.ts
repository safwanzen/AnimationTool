import Command from "./Command";

export class DrawCommand implements Command {
    #ctx: CanvasRenderingContext2D

    constructor(
        ctx: CanvasRenderingContext2D,
        private before: ImageData,
        private after: ImageData
    ) 
    { 
        this.#ctx = ctx
    }
    
    execute(): void {
        this.#ctx.putImageData(this.after, 0, 0);
        console.log("execute draw");
    }
    undo(): void {
        this.#ctx.putImageData(this.before, 0, 0);
        console.log("undo draw");
    }

}