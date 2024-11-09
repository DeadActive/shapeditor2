import { Renderer } from '../core/Renderer.js';
import { HistoryPanel } from './HistoryPanel.js';
import { ExamplePanel } from './ExamplePanel.js';
import { RenderModePanel } from './RenderModePanel.js';
import { ViewportPanel } from './ViewportPanel.js';
import { PerformancePanel } from './PerformancePanel.js';
import { PanelStack } from './PanelStack.js';
import { ToolOverlay } from '../core/tools/ToolOverlay.js';
import { TreePanel } from './TreePanel.js';
import { AppContext } from '../core/AppContext.js';

/**
 * @class UIManager
 * @description Управляет всеми UI компонентами приложения.
 */
export class UIManager {
    constructor() {
        const app = AppContext.getApp();
        this.renderer = new Renderer(app.tree, app.container);
        this.panelStack = new PanelStack();
        this.toolOverlay = new ToolOverlay(app.container);

        // Создаем панели
        this.historyPanel = new HistoryPanel(app.tree, this.renderer);
        this.examplePanel = new ExamplePanel();
        this.renderModePanel = new RenderModePanel(this.renderer);
        this.viewportPanel = new ViewportPanel(app.tree);
        this.performancePanel = new PerformancePanel();
        this.treePanel = new TreePanel(app.tree);
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
        this.viewportPanel.init();
        this.performancePanel.init();
        this.treePanel.init();

        // Добавляем панели в стек
        this.panelStack.addPanel(this.treePanel);
        this.panelStack.addPanel(this.viewportPanel);
        this.panelStack.addPanel(this.examplePanel);
        this.panelStack.addPanel(this.performancePanel);
        this.panelStack.addPanel(this.historyPanel);
        this.panelStack.addPanel(this.renderModePanel);
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы UI компонентов.
     */
    dispose() {
        this.renderer.dispose();
        this.panelStack.dispose();
        this.toolOverlay.dispose();
        this.performancePanel.dispose();
    }
}
