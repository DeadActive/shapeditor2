import { Command } from './Command.js';

/**
 * @class MoveNodeUpCommand
 * @extends Command
 * @description Команда для перемещения узла вверх в иерархии.
 */
export class MoveNodeUpCommand extends Command {
    /**
     * @param {Node} node - Узел для перемещения.
     */
    constructor(node) {
        super();
        this.node = node;
        this.oldIndex = node.getZIndex();
    }

    execute() {
        return this.node.moveUp();
    }

    undo() {
        if (this.oldIndex >= 0) {
            while (this.node.getZIndex() > this.oldIndex) {
                this.node.moveDown();
            }
        }
    }
}

/**
 * @class MoveNodeDownCommand
 * @extends Command
 * @description Команда для перемещения узла вниз в иерархии.
 */
export class MoveNodeDownCommand extends Command {
    /**
     * @param {Node} node - Узел для перемещения.
     */
    constructor(node) {
        super();
        this.node = node;
        this.oldIndex = node.getZIndex();
    }

    execute() {
        return this.node.moveDown();
    }

    undo() {
        if (this.oldIndex >= 0) {
            while (this.node.getZIndex() < this.oldIndex) {
                this.node.moveUp();
            }
        }
    }
}

/**
 * @class MoveNodeToTopCommand
 * @extends Command
 * @description Команда для перемещения узла в самый верх иерархии.
 */
export class MoveNodeToTopCommand extends Command {
    /**
     * @param {Node} node - Узел для перемещения.
     */
    constructor(node) {
        super();
        this.node = node;
        this.oldIndex = node.getZIndex();
    }

    execute() {
        return this.node.moveToTop();
    }

    undo() {
        if (this.oldIndex >= 0) {
            while (this.node.getZIndex() > this.oldIndex) {
                this.node.moveDown();
            }
        }
    }
}

/**
 * @class MoveNodeToBottomCommand
 * @extends Command
 * @description Команда для перемещения узла в самый низ иерархии.
 */
export class MoveNodeToBottomCommand extends Command {
    /**
     * @param {Node} node - Узел для перемещения.
     */
    constructor(node) {
        super();
        this.node = node;
        this.oldIndex = node.getZIndex();
    }

    execute() {
        return this.node.moveToBottom();
    }

    undo() {
        if (this.oldIndex >= 0) {
            while (this.node.getZIndex() < this.oldIndex) {
                this.node.moveUp();
            }
        }
    }
}
