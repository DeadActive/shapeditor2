import { CommandDescription } from './CommandDescription.js';
import {
    MoveNodeUpCommand,
    MoveNodeDownCommand,
    MoveNodeToTopCommand,
    MoveNodeToBottomCommand,
} from '../ZIndexCommands.js';

export class MoveNodeUpDescription extends CommandDescription {
    getDescription() {
        return `Move Up "${this.command.node.name}"`;
    }
}

export class MoveNodeDownDescription extends CommandDescription {
    getDescription() {
        return `Move Down "${this.command.node.name}"`;
    }
}

export class MoveNodeToTopDescription extends CommandDescription {
    getDescription() {
        return `Move to Top "${this.command.node.name}"`;
    }
}

export class MoveNodeToBottomDescription extends CommandDescription {
    getDescription() {
        return `Move to Bottom "${this.command.node.name}"`;
    }
}
