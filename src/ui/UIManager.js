import { Renderer } from '../core/Renderer.js';
import { HistoryPanel } from './HistoryPanel.js';
import { ExamplePanel } from './ExamplePanel.js';
import { RenderModePanel } from './RenderModePanel.js';
import { PanelStack } from './PanelStack.js';

/**
 * @class UIManager
 * @description Управляет всеми UI компонентами приложения.
 */
export class UIManager {
    /**
     * @param {App} app - Экземпляр приложения.
     */
    constructor(app) {
        this.app = app;
        this.renderer = new Renderer(app.tree, app.container);
        this.panelStack = new PanelStack();

        // Создаем панели
        this.historyPanel = new HistoryPanel(app.tree, this.renderer);
        this.examplePanel = new ExamplePanel(app.exampleManager);
        this.renderModePanel = new RenderModePanel(this.renderer);
    }

    /**
     * @method init
     * @description Инициализирует все UI компоненты.
     */
    init() {
        this.renderer.init();

        // Инициализируем панели
        this.historyPanel.init();
        this.examplePanel.init();
        this.renderModePanel.init();

        // Добавляем панели в стек
        this.panelStack.addPanel(this.historyPanel);
        this.panelStack.addPanel(this.examplePanel);
        this.panelStack.addPanel(this.renderModePanel);
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы UI компонентов.
     */
    dispose() {
        this.renderer.dispose();
        this.panelStack.dispose();
    }
}
