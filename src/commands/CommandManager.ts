import Command from "./Command"

export class CommandManager {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private MAX_STACK: number = 10; // limit undo until i implement optimized undo

    execute(command: Command): void {
        command.execute();
        this.undoStack.push(command);
        if (this.undoStack.length > this.MAX_STACK) {
            this.undoStack.shift();
        }
        this.redoStack = [];
        // console.log(this.undoStack);
        console.log(this.undoStack.length);
    }

    undo(): void {
        let cmd = this.undoStack.pop();
        if (!cmd) return;
        cmd.undo();
        this.redoStack.push(cmd);
        //console.log(this.undoStack);
    }
    
    redo(): void {
        let cmd = this.redoStack.pop();
        if (!cmd) return;
        cmd.execute();
        this.undoStack.push(cmd);
        //console.log(this.undoStack);
    }

    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
    }

    canUndo(): boolean { 
        return this.undoStack.length > 0;
     }
    canRedo(): boolean { 
        return this.redoStack.length > 0;
     }
}