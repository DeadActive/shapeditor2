import { CommandDescriptionFactory } from '../core/commands/description/CommandDescriptionFactory.js';
import { Tree } from '../core/Tree.js';
import { Command } from '../core/commands/Command.js';

/**
 * @class HistoryPanel
 * @description UI панель для отображения и управления историей команд.
 */
export class HistoryPanel {
    /**
     * @param {Tree} tree - Дерево с историей команд.
     */
    constructor(tree, renderer) {
        this.tree = tree;
        this.renderer = renderer;
        this.panel = null;
        this.historyList = null;
        this.redoList = null;
    }

    /**
     * @method init
     * @description Инициализирует панель истории.
     */
    init() {
        // Создаем основной контейнер
        this.panel = document.createElement('div');
        this.panel.className = 'history-panel';

        // Создаем кнопки управления
        const controls = document.createElement('div');
        controls.className = 'history-controls';

        const undoButton = document.createElement('button');
        undoButton.textContent = 'Undo';
        undoButton.onclick = () => {
            this.tree.undo();
            this.update();
        };

        const redoButton = document.createElement('button');
        redoButton.textContent = 'Redo';
        redoButton.onclick = () => {
            this.tree.redo();
            this.update();
        };

        controls.appendChild(undoButton);
        controls.appendChild(redoButton);

        // Создаем списки истории
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';

        const historyTitle = document.createElement('h3');
        historyTitle.textContent = 'History';
        this.historyList = document.createElement('ul');
        this.historyList.className = 'history-list';

        const redoTitle = document.createElement('h3');
        redoTitle.textContent = 'Redo Stack';
        this.redoList = document.createElement('ul');
        this.redoList.className = 'redo-list';

        historyContainer.appendChild(historyTitle);
        historyContainer.appendChild(this.historyList);
        historyContainer.appendChild(redoTitle);
        historyContainer.appendChild(this.redoList);

        // Собираем панель
        this.panel.appendChild(controls);
        this.panel.appendChild(historyContainer);

        // Добавляем на страницу
        document.body.appendChild(this.panel);

        // Подписываемся на обновления дерева
        const originalExecuteCommand = this.tree.executeCommand;
        this.tree.executeCommand = command => {
            originalExecuteCommand.call(this.tree, command);
            this.update();
        };

        const originalUndo = this.tree.undo;
        this.tree.undo = () => {
            originalUndo.call(this.tree);
            this.update();
        };

        const originalRedo = this.tree.redo;
        this.tree.redo = () => {
            originalRedo.call(this.tree);
            this.update();
        };

        // Первичное обновление
        this.update();
    }

    /**
     * @method update
     * @description Обновляет отображение истории.
     */
    update() {
        // Очищаем списки
        this.historyList.innerHTML = '';
        this.redoList.innerHTML = '';

        // Обновляем список истории
        this.tree.history.forEach((command, index) => {
            const item = document.createElement('li');
            item.textContent = this._getCommandDescription(command);
            this.historyList.appendChild(item);
        });

        // Обновляем список redo
        this.tree.redoStack.forEach((command, index) => {
            const item = document.createElement('li');
            item.textContent = this._getCommandDescription(command);
            this.redoList.appendChild(item);
        });
    }

    /**
     * @method _getCommandDescription
     * @private
     * @description Возвращает описание команды для отображения.
     * @param {Command} command - Команда.
     * @returns {string} Описание команды.
     */
    _getCommandDescription(command) {
        return CommandDescriptionFactory.getDescription(command);
    }
}
