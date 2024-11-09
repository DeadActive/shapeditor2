/**
 * @class Tree
 * @description Представляет дерево узлов с обновлением только изменённых узлов.
 */
export class Tree {
    /**
     * @param {Node} root - Корневой узел дерева.
     * @param {Renderer} [renderer=null] - Рендерер для автоматического обновления.
     */
    constructor(root, renderer = null) {
        this.root = root;
        this.history = [];
        this.redoStack = [];
        this.renderer = renderer;
    }

    /**
     * @method setRenderer
     * @description Устанавливает рендерер для автоматического обновления.
     * @param {Renderer} renderer - Рендерер.
     */
    setRenderer(renderer) {
        this.renderer = renderer;
    }

    /**
     * @method update
     * @description Обновляет только изменённые узлы.
     */
    update() {
        function recurse(node) {
            if (node.dirty) {
                node.clearDirty();
            }
            node.children.forEach(recurse);
        }
        recurse(this.root);
    }

    /**
     * @method executeCommand
     * @description Выполняет команду и добавляет её в историю.
     * @param {Command} command - Команда для выполнения.
     */
    executeCommand(command) {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Очистить стек для повторного выполнения
        this.root.markDirty();
        if (this.renderer) {
            this.renderer.update();
        }
    }

    /**
     * @method undo
     * @description Отменяет последнюю команду.
     */
    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
            this.root.markDirty();
            if (this.renderer) {
                this.renderer.update();
            }
        }
    }

    /**
     * @method redo
     * @description Повторяет последнюю отменённую команду.
     */
    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
            this.root.markDirty();
            if (this.renderer) {
                this.renderer.update();
            }
        }
    }
}
