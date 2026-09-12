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

const plusButton = document.getElementById('sizeup') as HTMLButtonElement;
const minusButton = document.getElementById('sizedown') as HTMLButtonElement;
const sizeText = document.getElementById('size') as HTMLDivElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d'
    //{ willReadFrequently: true } // getImageData is no longer used so this isn't needed
) as CanvasRenderingContext2D;
const text = document.getElementById('action');

const commandManager: CommandManager = new CommandManager();

let tool: Tools = Tools.BrushRound;

let brushSize = 5;
let eraserSize = 5;

const MAX_BRUSHSIZE = 256;
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

sizeText.textContent = brushSize.toString();

rbrush.setSize(brushSize);
console.log(rbrush.size);

function setText(t: string) {
    if (text == null) return;
}


let drawing = false;
let lastMouseX = 0;
let lastMouseY = 0;
let currMouseX = 0;
let currMouseY = 0;

let beforeDraw: Uint8ClampedArray; 

// draw command optimization: only track the rectangle where pixels changed
// dirty rect

clearButton.addEventListener("click", (e) => {
    let before = bitmap.pixels.slice();
    bitmap.clear();
    commandManager.execute(new DrawCommand(bitmap, before, bitmap.pixels.slice()));
    //renderer.render();
});

undoButton.addEventListener("click", _ => commandManager.undo());
redoButton.addEventListener("click", _ => commandManager.redo());
brushButton.addEventListener("click", _ => {
    tool = Tools.BrushRound;
    rbrush.color = black;
    setBrushSize(brushSize);
});
eraserButton.addEventListener("click", _ => {
    tool = Tools.Eraser;
    rbrush.color = transparent;
    setBrushSize(eraserSize);
});
plusButton.addEventListener("click", _ => {
    let size = 0;
    if (tool == Tools.BrushRound) {
        brushSize++;
        if (brushSize > MAX_BRUSHSIZE) brushSize = MAX_BRUSHSIZE;
        size = brushSize;
    }
    else if (tool == Tools.Eraser) {
        eraserSize++;
        if (eraserSize > MAX_BRUSHSIZE) eraserSize = MAX_BRUSHSIZE;
        size = eraserSize;
    }
    setBrushSize(size);
});
minusButton.addEventListener("click", _ => {
    let size = 0;
    if (tool == Tools.BrushRound) {
        brushSize--
    if (brushSize < 0) brushSize = 0;
        size = brushSize;
    }
    else if (tool == Tools.Eraser) {
        eraserSize--;
        if (eraserSize < 0) eraserSize = 0;
        size = eraserSize;
    }
    setBrushSize(size);
});

canvas.addEventListener("mousedown", (e) => {
    
    beforeDraw = bitmap.pixels.slice(0, bitmap.pixels.length);
    drawing = true;
    //setText("mousedown");
    const x = e.offsetX;
    const y = e.offsetY;

    rbrush.draw(e.offsetX, e.offsetY);

    lastMouseX = x;
    lastMouseY = y;
});

canvas.addEventListener("mousemove", (e) => {
    //setText("mousemove");

    const x = e.offsetX;
    const y = e.offsetY;

    currMouseX = x;
    currMouseY = y;

    // drawing operation
    if (!drawing) return;


    rbrush.drawLine(lastMouseX, lastMouseY, x, y);
    //renderer.render();

    lastMouseX = x;
    lastMouseY = y;
});

canvas.addEventListener("mouseup", (e) => {
    //setText("mouseup");
    drawing = false;
    if (!beforeDraw) return;
    commandManager.execute(new DrawCommand(bitmap, beforeDraw, bitmap.pixels.slice(0, bitmap.pixels.length)));
});

canvas.addEventListener("mouseenter", (e) => {
    canvas.style.cursor = "none";
});

canvas.addEventListener("mouseleave", (e) => {
    
});

function setBrushSize(size: number) {
    sizeText.textContent = size.toString();
    rbrush.setSize(size);
    console.log(rbrush.size);
}

function renderBrushSymbol() {
    let size = 0;
    if (tool == Tools.BrushRound) {
        size = brushSize;
    }
    else if (tool == Tools.Eraser) {
        size = eraserSize;
    }

    ctx.beginPath();
    ctx.arc(currMouseX, currMouseY, size / 2, 0, Math.PI * 2);
    ctx.stroke();
}

function adjustBrush(size: number) {
    if (tool == Tools.BrushRound) {
        brushSize = size;
    }
    else if (tool == Tools.Eraser) {
        eraserSize = size;
    }
}

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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderer.render();
    renderBrushSymbol();

    requestAnimationFrame(draw);
}

draw();