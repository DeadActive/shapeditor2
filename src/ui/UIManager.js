import { Renderer } from '../core/Renderer.js';
import { HistoryPanel } from './HistoryPanel.js';
import { App } from '../App.js';

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
        this.historyPanel = new HistoryPanel(app.tree, this.renderer);
    }

    /**
     * @method init
     * @description Инициализирует все UI компоненты.
     */
    init() {
        this.renderer.init();
        this.historyPanel.init();
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы UI компонентов.
     */
    dispose() {
        this.renderer.dispose();
    }
}
