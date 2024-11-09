import { CommandDescription } from './CommandDescription.js';

/**
 * @class CloneNodeDescription
 * @extends CommandDescription
 * @description Описание команды клонирования узла.
 */
export class CloneNodeDescription extends CommandDescription {
    getDescription() {
        return `Clone ${this.command.node.name}`;
    }
}

/**
 * @class BatchCloneNodesDescription
 * @extends CommandDescription
 * @description Описание команды клонирования нескольких узлов.
 */
export class BatchCloneNodesDescription extends CommandDescription {
    getDescription() {
        return `Clone ${this.command.nodes.length} nodes`;
    }
}
