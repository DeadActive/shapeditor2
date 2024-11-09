import { CommandDescription } from './CommandDescription.js';
import {
    UpdatePropertyCommand,
    AddChildCommand,
    RemoveChildCommand,
    BatchAddChildCommand,
    BatchRemoveChildCommand,
    MoveNodeCommand,
    SetNodePositionCommand,
    BatchMoveNodesCommand,
} from '../NodeCommands.js';

export class UpdatePropertyDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Update "${command.node.name}" ${command.key}`;
    }
}

export class AddChildDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Add "${command.child.name}" to "${command.parent.name}"`;
    }
}

export class RemoveChildDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Remove "${command.child.name}" from "${command.parent.name}"`;
    }
}

export class BatchAddChildDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Add ${command.children.length} children to "${command.parent.name}"`;
    }
}

export class BatchRemoveChildDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Remove ${command.children.length} children from "${command.parent.name}"`;
    }
}

export class MoveNodeDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Move "${command.node.name}" (${command.dx}, ${command.dy})`;
    }
}

export class SetNodePositionDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Set "${command.node.name}" position (${command.newX}, ${command.newY})`;
    }
}

export class BatchMoveNodesDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Move ${command.nodes.length} nodes (${command.dx}, ${command.dy})`;
    }
}
