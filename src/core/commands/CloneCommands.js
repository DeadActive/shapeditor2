import { Command } from './Command.js';
import { BatchAddChildCommand } from './NodeCommands.js';

/**
 * @class CloneNodeCommand
 * @extends Command
 * @description Команда для клонирования узла.
 */
export class CloneNodeCommand extends Command {
    /**
     * @param {Node} node - Узел для клонирования.
     * @param {Node} parent - Родительский узел для клона.
     * @param {string} [newId] - Новый идентификатор для клона (опционально).
     */
    constructor(node, parent, newId = null) {
        super();
        this.node = node;
        this.parent = parent;
        this.newId = newId;
        this.clone = null;
        this.addCommand = null;
    }

    execute() {
        // Создаем клон если еще не создан
        if (!this.clone) {
            this.clone = this.node.clone(this.newId);
        }

        // Создаем и выполняем команду добавления
        this.addCommand = new BatchAddChildCommand(this.parent, [this.clone]);
        this.addCommand.execute();
    }

    undo() {
        this.addCommand.undo();
    }
}

/**
 * @class BatchCloneNodesCommand
 * @extends Command
 * @description Команда для клонирования нескольких узлов.
 */
export class BatchCloneNodesCommand extends Command {
    /**
     * @param {Node[]} nodes - Массив узлов для клонирования.
     * @param {Node} parent - Родительский узел для клонов.
     */
    constructor(nodes, parent) {
        super();
        this.nodes = nodes;
        this.parent = parent;
        this.cloneCommands = [];
    }

    execute() {
        this.cloneCommands = this.nodes.map(node => {
            const command = new CloneNodeCommand(node, this.parent);
            command.execute();
            return command;
        });
    }

    undo() {
        // Отменяем команды в обратном порядке
        for (let i = this.cloneCommands.length - 1; i >= 0; i--) {
            this.cloneCommands[i].undo();
        }
    }
}
