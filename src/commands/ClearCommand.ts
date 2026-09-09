import Command from './Command';

export class ClearCommand implements Command {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private canvas: HTMLCanvasElement,
        private before: ImageData,
        private after: ImageData,
    ) {}
    execute(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(this.after, 0, 0);
    }
    undo(): void {
        this.ctx.putImageData(this.before, 0, 0);
    }
    
}