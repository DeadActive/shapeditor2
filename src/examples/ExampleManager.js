import { ZIndexExample } from './ZIndexExample.js';
import { PerformanceExample } from './PerformanceExample.js';

/**
 * @class ExampleManager
 * @description Управляет доступными примерами и их загрузкой.
 */
export class ExampleManager {
    constructor(app) {
        this.app = app;
        this.examples = new Map();
        this.currentExample = null;
        this.initExamples();
    }

    /**
     * @method initExamples
     * @private
     * @description Инициализирует доступные примеры.
     */
    initExamples() {
        const examples = [new ZIndexExample(), new PerformanceExample()];

        examples.forEach(example => {
            this.examples.set(example.id, example);
        });
    }

    /**
     * @method loadExample
     * @description Загружает выбранный пример.
     * @param {string} id - Идентификатор примера.
     */
    loadExample(id) {
        const example = this.examples.get(id);
        if (!example) {
            throw new Error(`Example with id "${id}" not found`);
        }

        // Очищаем текущий пример
        this.app.tree.root.children = [];
        this.app.tree.history = [];
        this.app.tree.redoStack = [];

        // Создаем новый пример
        this.currentExample = example;
        const result = example.create(this.app.tree);
        this.app.uiManager.renderer.update();

        return result;
    }

    /**
     * @method getCurrentExample
     * @description Возвращает текущий загруженный пример.
     * @returns {Example|null} Текущий пример или null.
     */
    getCurrentExample() {
        return this.currentExample;
    }

    /**
     * @method getExampleList
     * @description Возвращает список доступных примеров.
     * @returns {Array<{id: string, name: string, description: string}>} Список примеров.
     */
    getExampleList() {
        return Array.from(this.examples.values()).map(example => ({
            id: example.id,
            name: example.name,
            description: example.description,
        }));
    }
}
