import { Node } from './Node.js';

/**
 * @class Curve
 * @extends Node
 * @description Абстрактный класс для представления кривой.
 */
export class Curve extends Node {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя кривой.
     * @param {string} curveType - Тип кривой.
     */
    constructor(id, name, curveType) {
        super(id, name, curveType);
    }

    /**
     * @method getPoints
     * @abstract
     * @description Возвращает точки кривой.
     */
    getPoints() {
        throw new Error('Method getPoints must be implemented');
    }

    /**
     * @method getSVGPathData
     * @description Возвращает строку для атрибута d SVG-пути.
     * @param {boolean} [isFirst=true] - Является ли кривая первой в пути.
     * @returns {string} Строка для атрибута d.
     */
    getSVGPathData(isFirst = true) {
        return this._getBaseSVGPathData(isFirst);
    }

    /**
     * @method _getBaseSVGPathData
     * @protected
     * @abstract
     * @description Возвращает базовую строку для атрибута d SVG-пути.
     * @param {boolean} [isFirst=true] - Является ли кривая первой в пути.
     * @returns {string} Строка для атрибута d.
     */
    _getBaseSVGPathData(isFirst) {
        throw new Error('Method _getBaseSVGPathData must be implemented');
    }
}
