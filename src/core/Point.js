import { Node } from './Node.js';

/**
 * @class Point
 * @extends Node
 * @description Абстрактный класс для представления точки.
 */
export class Point extends Node {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя точки.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     */
    constructor(id, name, x, y) {
        super(id, name, 'point');
        this.x = x;
        this.y = y;
    }

    /**
     * @method move
     * @description Перемещает точку.
     * @param {number} x - Новая координата X.
     * @param {number} y - Новая координата Y.
     */
    move(x, y) {
        this.updateProperty('x', x);
        this.updateProperty('y', y);
    }
}
