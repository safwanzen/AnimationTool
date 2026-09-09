import { CommandManager } from "./commands/CommandManager";
import { DrawCommand } from "./commands/DrawCommand";
import { Tool as Tools } from "./types/Tools"
import Bitmap from "./types/Bitmap";
import Renderer from "./types/Renderer";
import { RoundBrush } from "./Brushes/RoundBrush";
import { Color } from "./types/Color";

const clearButton = document.getElementById('clear') as HTMLButtonElement;
const undoButton = document.getElementById('undo') as HTMLButtonElement;
const redoButton = document.getElementById('redo') as HTMLButtonElement;
const brushButton = document.getElementById('brush') as HTMLButtonElement;
const eraserButton = document.getElementById('eraser') as HTMLButtonElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
const text = document.getElementById('action');

const commandManager: CommandManager = new CommandManager();

let tool: Tools = Tools.BrushRound;
let brushSize = 5;
let brushColor = "#000000";

let lineWidth: number = 0;
let lineCap: CanvasLineCap = "round";
let lineJoin: CanvasLineJoin = "round";
let strokeStyle: string = "#000000";

canvas.width = 800;
canvas.height = 600;
canvas.style.background = "#d4caa9"

ctx.lineWidth = lineWidth;
ctx.lineCap = lineCap;
ctx.lineJoin = lineJoin;
ctx.strokeStyle = strokeStyle;

// use own Bitmap implementation instead of relying on HTMLCanvasElement
// ctx is only used for putting pixels onto the canvas
// all draw operations will be done on the bitmap
const bitmap = new Bitmap(canvas.width, canvas.height);
const renderer = new Renderer(ctx, bitmap);

let rbrush = new RoundBrush(bitmap, 10, { r: 0, g: 0, b: 0, a: 255 });
const black: Color = { r: 0, g: 0, b: 0, a: 255 };
const transparent: Color = { r: 0, g: 0, b: 0, a: 0 };

function setText(t: string) {
    if (text == null) return;
}

let drawing = false;
let lastX = 0;
let lastY = 0;

let beforeDraw: Uint8ClampedArray; 

clearButton.addEventListener("click", (e) => {
    //let before = ctx.getImageData(0, 0, canvas.width, canvas.height);
    bitmap.clear();
    renderer.render();
    //let after = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //commandManager.execute(new DrawCommand(ctx, before, after));
});

undoButton.addEventListener("click", _ => commandManager.undo());
redoButton.addEventListener("click", _ => commandManager.redo());
brushButton.addEventListener("click", _ => rbrush.color = black);
eraserButton.addEventListener("click", _ => rbrush.color = transparent);

canvas.addEventListener("mousedown", (e) => {
    
    // beforeDraw = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawing = true;
    //setText("mousedown");
    const x = e.offsetX;
    const y = e.offsetY;

    rbrush.draw(e.offsetX, e.offsetY);
    renderer.render();

    lastX = x;
    lastY = y;
});

canvas.addEventListener("mousemove", (e) => {
    //setText("mousemove");
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    rbrush.drawLine(lastX, lastY, x, y);
    renderer.render();

    lastX = x;
    lastY = y;
});

canvas.addEventListener("mouseup", (e) => {
    //setText("mouseup");
    drawing = false;

    let after = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //if (!beforeDraw) return;
    //commandManager.execute(new DrawCommand(bitmap, beforeDraw, after));
});

function drawLine(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const steps = Math.ceil(distance);

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const x = x1 + dx * t;
        const y = y1 + dy * t;

        rbrush.draw(x, y)
        //drawBrush(x, y);
    }
}

function drawBrush(x: number, y: number) {
    rbrush.draw(x, y);
}

setText("halu");