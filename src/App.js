import { Tree } from './core/Tree.js';
import { Canvas } from './core/Canvas.js';
import { UIManager } from './ui/UIManager.js';
import { EventManager } from './events/EventManager.js';
import { ExampleManager } from './examples/ExampleManager.js';
import { SelectionTool } from './core/tools/SelectionTool.js';
import { AppContext } from './core/AppContext.js';

/**
 * @class App
 * @description Главный класс приложения, управляющий всеми компонентами.
 */
export class App {
    /**
     * @param {HTMLElement} container - Контейнер для приложения.
     */
    constructor(container) {
        AppContext.setApp(this);
        this.container = container;
        this.canvas = new Canvas('main', 'Main Canvas', 800, 600);
        this.tree = new Tree(this.canvas);
        this.eventManager = new EventManager();
        this.exampleManager = new ExampleManager();
        this.uiManager = new UIManager();
        this.activeTool = null;
        this.activeNode = null;
    }

    /**
     * @method setActiveNode
     * @description Устанавливает активный узел.
     * @param {Node|null} node - Узел для активации или null для сброса.
     */
    setActiveNode(node) {
        if (this.activeNode === node) return;
        this.activeNode = node;
        this.tree.root.markDirty();
        this.tree.renderer.update();
    }

    /**
     * @method init
     * @description Инициализирует приложение.
     */
    init() {
        // Инициализируем UI
        this.uiManager.init();

        // Инициализируем обработчики событий
        this.eventManager.init();

        // Загружаем пример по умолчанию
        this.exampleManager.loadExample('clone');
        this.uiManager.examplePanel.updateDescription();

        // Инициализируем и активируем инструмент выделения
        this.activeTool = new SelectionTool(this.uiManager.toolOverlay);
        this.activeTool.activate();

        // Устанавливаем обработчик очистки
        window.addEventListener('unload', () => this.dispose());
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы приложения.
     */
    dispose() {
        if (this.activeTool) {
            this.activeTool.deactivate();
        }
        this.eventManager.dispose();
        this.uiManager.dispose();
        AppContext.clear();
    }
}
