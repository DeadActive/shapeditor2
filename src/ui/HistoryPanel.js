import { Panel } from './Panel.js';
import { CommandDescriptionFactory } from '../core/commands/description/CommandDescriptionFactory.js';
import { AppContext } from '../core/AppContext.js';

/**
 * @class HistoryPanel
 * @extends Panel
 * @description UI панель для отображения и управления историей команд.
 */
export class HistoryPanel extends Panel {
    constructor() {
        super('History', 'history-panel');
        this.historyList = null;
        this.redoList = null;
    }

    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем списки истории
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';

        // Создаем список истории
        this.historyList = document.createElement('ul');
        this.historyList.className = 'history-list';
        historyContainer.appendChild(this.historyList);

        // Создаем список redo
        this.redoList = document.createElement('ul');
        this.redoList.className = 'redo-list';
        historyContainer.appendChild(this.redoList);

        // Создаем кнопки управления
        const controls = document.createElement('div');
        controls.className = 'history-controls';

        const undoButton = document.createElement('button');
        undoButton.className = 'history-button undo-button';
        undoButton.innerHTML = '↶';
        undoButton.title = 'Undo';
        undoButton.onclick = () => {
            AppContext.getApp().tree.undo();
            this.update();
        };

        const redoButton = document.createElement('button');
        redoButton.className = 'history-button redo-button';
        redoButton.innerHTML = '↷';
        redoButton.title = 'Redo';
        redoButton.onclick = () => {
            AppContext.getApp().tree.redo();
            this.update();
        };

        controls.appendChild(undoButton);
        controls.appendChild(redoButton);

        // Добавляем контейнеры в панель
        this.content.appendChild(historyContainer);
        this.content.appendChild(controls);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Подписываемся на обновления дерева
        const originalExecuteCommand = AppContext.getApp().tree.executeCommand;
        AppContext.getApp().tree.executeCommand = command => {
            originalExecuteCommand.call(AppContext.getApp().tree, command);
            this.update();
        };

        // Регистрируем callback для обновления истории
        AppContext.getApp().tree.setHistoryUpdateCallback(() => this.update());

        // Первичное обновление
        this.update();

        // Восстанавливаем состояние сворачивания
        this.restoreState();
    }

    /**
     * @method update
     * @description Обновляет отображение истории.
     */
    update() {
        const app = AppContext.getApp();
        // Очищаем списки
        this.historyList.innerHTML = '';
        this.redoList.innerHTML = '';

        // Обновляем список истории
        app.tree.history.forEach(command => {
            const item = document.createElement('li');
            item.textContent = this._getCommandDescription(command);
            this.historyList.appendChild(item);
        });

        // Обновляем список redo
        app.tree.redoStack.forEach(command => {
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
