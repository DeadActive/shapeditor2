import { Tree } from './core/Tree.js';
import { Canvas } from './core/Canvas.js';
import { UIManager } from './ui/UIManager.js';
import { EventManager } from './events/EventManager.js';
import { createZIndexExample } from './examples/ZIndexExample.js';

/**
 * @class App
 * @description Главный класс приложения, управляющий всеми компонентами.
 */
export class App {
    /**
     * @param {HTMLElement} container - Контейнер для приложения.
     */
    constructor(container) {
        this.container = container;
        this.canvas = new Canvas('main', 'Main Canvas', 800, 600);
        this.tree = new Tree(this.canvas);
        this.uiManager = new UIManager(this);
        this.eventManager = new EventManager(this);
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

        // Загружаем пример
        this.loadExample();

        // Устанавливаем обработчик очистки
        window.addEventListener('unload', () => this.dispose());
    }

    /**
     * @method loadExample
     * @description Загружает пример для демонстрации.
     */
    loadExample() {
        const example = createZIndexExample(this.tree);
        this.uiManager.renderer.update();
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы приложения.
     */
    dispose() {
        this.eventManager.dispose();
        this.uiManager.dispose();
    }
}
