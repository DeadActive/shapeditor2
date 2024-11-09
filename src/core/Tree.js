import { CommandRecorder } from './commands/CommandRecorder.js';

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
        this.commandRecorder = new CommandRecorder();
        this.historyUpdateCallback = null;
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
     * @method setHistoryUpdateCallback
     * @description Устанавливает callback для обновления истории.
     * @param {Function} callback - Функция обновления истории.
     */
    setHistoryUpdateCallback(callback) {
        this.historyUpdateCallback = callback;
    }

    /**
     * @method notifyHistoryUpdate
     * @private
     * @description Уведомляет об обновлении истории.
     */
    notifyHistoryUpdate() {
        if (this.historyUpdateCallback) {
            this.historyUpdateCallback();
        }
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
        // Записываем команду если идет запись
        if (this.commandRecorder.isRecording) {
            this.commandRecorder.recordCommand(command);
            command.execute();
            this.root.markDirty();
            if (this.renderer) {
                this.renderer.update();
            }
            return;
        }

        // Обычное выполнение команды
        command.execute();
        this.history.push(command);
        this.redoStack = [];
        this.root.markDirty();
        if (this.renderer) {
            this.renderer.update();
        }
        this.notifyHistoryUpdate();
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
            this.notifyHistoryUpdate();
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
            this.notifyHistoryUpdate();
        }
    }

    /**
     * @method startRecording
     * @description Начинает запись команд.
     * @param {string} name - Имя для композитной команды.
     */
    startRecording(name) {
        this.commandRecorder = new CommandRecorder(name);
        this.commandRecorder.startRecording();
    }

    /**
     * @method stopRecording
     * @description Останавливает запись и выполняет композитную команду.
     */
    stopRecording() {
        const compositeCommand = this.commandRecorder.stopRecording();
        if (!compositeCommand.isEmpty()) {
            // Добавляем композитную команду в историю без повторного выполнения
            this.history.push(compositeCommand);
            this.redoStack = [];
            // Обновляем рендерер если нужно
            if (this.renderer) {
                this.renderer.update();
            }
            this.notifyHistoryUpdate();
        }
        this.commandRecorder = new CommandRecorder();
    }
}
