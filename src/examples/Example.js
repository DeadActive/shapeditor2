/**
 * @class Example
 * @description Базовый класс для всех примеров.
 */
export class Example {
    /**
     * @param {string} id - Уникальный идентификатор примера.
     * @param {string} name - Отображаемое имя примера.
     * @param {string} description - Описание примера.
     */
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    /**
     * @method create
     * @description Создает пример в дереве.
     * @param {Tree} tree - Дерево для добавления примера.
     * @returns {Object} Результат создания примера.
     */
    create(tree) {
        throw new Error('Method create() must be implemented');
    }
}
