import Command from "./Command"

export class CommandManager {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    execute(command: Command): void {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
        console.log(this.undoStack);
    }

    undo(): void {
        let cmd = this.undoStack.pop();
        if (!cmd) return;
        cmd.undo();
        this.redoStack.push(cmd);
        console.log(this.undoStack);
    }
    
    redo(): void {
        let cmd = this.redoStack.pop();
        if (!cmd) return;
        cmd.execute();
        this.undoStack.push(cmd);
        console.log(this.undoStack);
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