import Command from "./Command";

export class DrawCommand implements Command {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private before: ImageData,
        private after: ImageData
    ) {}
    
    execute(): void {
        this.ctx.putImageData(this.after, 0, 0);
    }
    undo(): void {
        this.ctx.putImageData(this.before, 0, 0);
    }

}