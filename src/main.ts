import { CommandManager } from "./commands/CommandManager";
import { DrawCommand } from "./commands/DrawCommand";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
const text = document.getElementById('action');
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const undoButton = document.getElementById('undo') as HTMLButtonElement;
const redoButton = document.getElementById('redo') as HTMLButtonElement;

const commandManager: CommandManager = new CommandManager();

console.log(text);

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

function setText(t: string) {
    if (text == null) return;
    text.innerText = t;
}

let drawing = false;
let lastX = 0;
let lastY = 0;

clearButton.addEventListener("click", (e) => {
    let before = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let after = ctx.getImageData(0, 0, canvas.width, canvas.height);
    commandManager.execute(new DrawCommand(ctx, before, after));
});

undoButton.addEventListener("click", (e) => commandManager.undo());

redoButton.addEventListener("click", (e) => commandManager.redo());

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    //setText("mousedown");
    const x = e.offsetX;
    const y = e.offsetY;
    drawBrush(e.offsetX, e.offsetY);
    lastX = x;
    lastY = y;
});

canvas.addEventListener("mousemove", (e) => {
    //setText("mousemove");
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    drawLine(lastX, lastY, x, y);

    lastX = x;
    lastY = y;
});

canvas.addEventListener("mouseup", (e) => {
    //setText("mouseup");
    drawing = false;
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

        drawBrush(x, y);
    }
}

function drawBrush(x: number, y: number) {
    ctx.beginPath();
    //ctx.ellipse(x, y, brushSize, brushSize, 0, 0, 360);
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.fill();
}

setText("halu");