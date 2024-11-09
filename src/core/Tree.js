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
     * @method traverse
     * @description Рекурсивно обходит дерево и выполняет callback для каждого узла.
     * @param {Function} callback - Функция, вызываемая для каждого узла.
     * @param {Node} [node=this.root] - Начальный узел обхода.
     * @param {Object} [options={
     *   skipDirtyCheck: false,
     *   direction: 'down',
     *   nodeTypes: null
     * }] - Опции обхода.
     */
    traverse(callback, node = this.root, options = {}) {
        const defaultOptions = {
            skipDirtyCheck: false, // Пропускать ли проверку на dirty
            direction: 'down', // 'up' для обхода снизу вверх, 'down' для сверху вниз
            nodeTypes: null, // Массив типов узлов для фильтрации или null для всех
        };

        const opts = { ...defaultOptions, ...options };

        // Проверяем тип узла если указан фильтр
        const isValidType = !opts.nodeTypes || opts.nodeTypes.includes(node.type);

        // Функция обработки узла
        const processNode = () => {
            if (isValidType && (opts.skipDirtyCheck || node.dirty)) {
                callback(node);
            }
        };

        // Выбираем порядок обхода
        if (opts.direction === 'down') {
            processNode();
            node.children.forEach(child => {
                this.traverse(callback, child, opts);
            });
        } else {
            node.children.forEach(child => {
                this.traverse(callback, child, opts);
            });
            processNode();
        }
    }

    /**
     * @method update
     * @description Обновляет только изменённые узлы.
     */
    update() {
        this.traverse(node => node.clearDirty(), this.root, { skipDirtyCheck: false });
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
