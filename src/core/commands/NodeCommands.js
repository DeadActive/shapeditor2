import { Command } from './Command.js';
import { Node } from '../Node.js';

/**
 * @class UpdatePropertyCommand
 * @description Команда для обновления свойства узла.
 */
export class UpdatePropertyCommand extends Command {
    constructor(node, key, newValue) {
        super();
        this.node = node;
        this.key = key;
        this.newValue = newValue;
        this.oldValue = node[key];
    }

    execute() {
        this.node.updateProperty(this.key, this.newValue);
    }

    undo() {
        this.node.updateProperty(this.key, this.oldValue);
    }
}

/**
 * @class AddChildCommand
 * @description Команда для добавления дочернего узла.
 */
export class AddChildCommand extends Command {
    constructor(parent, child) {
        super();
        this.parent = parent;
        this.child = child;
    }

    execute() {
        this.parent.addChild(this.child);
    }

    undo() {
        this.parent.removeChild(this.child.id);
    }
}

/**
 * @class RemoveChildCommand
 * @description Команда для удаления дочернего узла.
 */
export class RemoveChildCommand extends Command {
    constructor(parent, child) {
        super();
        this.parent = parent;
        this.child = child;
    }

    execute() {
        this.parent.removeChild(this.child.id);
    }

    undo() {
        this.parent.addChild(this.child);
    }
}

/**
 * @class BatchAddChildCommand
 * @description Команда для добавления нескольких дочерних узлов.
 */
export class BatchAddChildCommand extends Command {
    constructor(parent, children) {
        super();
        this.parent = parent;
        this.children = children;
    }

    execute() {
        this.children.forEach(child => this.parent.addChild(child));
    }

    undo() {
        this.children.forEach(child => this.parent.removeChild(child.id));
    }
}

/**
 * @class BatchRemoveChildCommand
 * @description Команда для удаления нескольких дочерних узлов.
 */
export class BatchRemoveChildCommand extends Command {
    constructor(parent, children) {
        super();
        this.parent = parent;
        this.children = children;
    }

    execute() {
        this.children.forEach(child => this.parent.removeChild(child.id));
    }

    undo() {
        this.children.forEach(child => this.parent.addChild(child));
    }
}

/**
 * @class MoveNodeCommand
 * @extends Command
 * @description Команда для перемещения узла.
 */
export class MoveNodeCommand extends Command {
    /**
     * @param {Node} node - Узел для перемещения.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    constructor(node, dx, dy) {
        super();
        this.node = node;
        this.dx = dx;
        this.dy = dy;
        this.oldX = node.x;
        this.oldY = node.y;
    }

    execute() {
        this.node.move(this.dx, this.dy);
    }

    undo() {
        this.node.setPosition(this.oldX, this.oldY);
    }
}

/**
 * @class SetNodePositionCommand
 * @extends Command
 * @description Команда для установки позиции узла.
 */
export class SetNodePositionCommand extends Command {
    /**
     * @param {Node} node - Узел для позиционирования.
     * @param {number} x - Новая координата X.
     * @param {number} y - Новая координата Y.
     */
    constructor(node, x, y) {
        super();
        this.node = node;
        this.newX = x;
        this.newY = y;
        this.oldX = node.x;
        this.oldY = node.y;
    }

    execute() {
        this.node.setPosition(this.newX, this.newY);
    }

    undo() {
        this.node.setPosition(this.oldX, this.oldY);
    }
}

/**
 * @class BatchMoveNodesCommand
 * @extends Command
 * @description Команда для одновременного перемещения нескольких узлов.
 */
export class BatchMoveNodesCommand extends Command {
    /**
     * @param {Node[]} nodes - Массив узлов для перемещения.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    constructor(nodes, dx, dy) {
        super();
        this.nodes = nodes;
        this.dx = dx;
        this.dy = dy;
        this.oldPositions = nodes.map(node => ({ x: node.x, y: node.y }));
    }

    execute() {
        this.nodes.forEach(node => node.move(this.dx, this.dy));
    }

    undo() {
        this.nodes.forEach((node, index) => {
            const oldPos = this.oldPositions[index];
            node.setPosition(oldPos.x, oldPos.y);
        });
    }
}
