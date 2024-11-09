import { ZIndexExample } from './ZIndexExample.js';
import { PerformanceExample } from './PerformanceExample.js';
import { CloneExample } from './CloneExample.js';
import { AppContext } from '../core/AppContext.js';

/**
 * @class ExampleManager
 * @description Управляет примерами и их загрузкой.
 */
export class ExampleManager {
    constructor() {
        this.examples = new Map([
            ['zindex', new ZIndexExample()],
            ['performance', new PerformanceExample()],
            ['clone', new CloneExample()],
        ]);
        this.currentExample = null;
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

        const app = AppContext.getApp();

        // Очищаем текущий пример
        app.tree.root.children = [];
        app.tree.history = [];
        app.tree.redoStack = [];

        // Создаем новый пример
        this.currentExample = example;
        const result = example.create(app.tree);
        app.uiManager.renderer.update();

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
