import Command from './Command'

export class AddFrameCommand implements Command {
    execute(): void {
        throw new Error('Method not implemented.');
    }
    undo(): void {
        throw new Error('Method not implemented.');
    }

}