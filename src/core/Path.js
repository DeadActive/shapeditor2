import { Node } from './Node.js';

/**
 * @class Path
 * @extends Node
 * @description Представляет путь, состоящий из кривых.
 */
export class Path extends Node {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя пути.
     */
    constructor(id, name) {
        super(id, name, 'path');
        this.closed = false;
        this.strokeColor = '#000000';
        this.strokeWidth = 1;
        this.fillColor = 'none';
    }

    /**
     * @method close
     * @description Замыкает путь.
     */
    close() {
        this.updateProperty('closed', true);
    }

    /**
     * @method open
     * @description Размыкает путь.
     */
    open() {
        this.updateProperty('closed', false);
    }

    /**
     * @method setStyle
     * @description Устанавливает стили пути.
     * @param {Object} style - Объект со стилями.
     */
    setStyle({ strokeColor, strokeWidth, fillColor }) {
        if (strokeColor !== undefined) this.updateProperty('strokeColor', strokeColor);
        if (strokeWidth !== undefined) this.updateProperty('strokeWidth', strokeWidth);
        if (fillColor !== undefined) this.updateProperty('fillColor', fillColor);
    }

    /**
     * @method getSVGPathData
     * @description Возвращает полную строку для атрибута d SVG-пути.
     * @returns {string} Строка для атрибута d.
     */
    getSVGPathData() {
        let pathData = '';
        this.children.forEach((curve, index) => {
            pathData += curve.getSVGPathData(index === 0);
        });
        if (this.closed) {
            pathData += ' Z';
        }
        return pathData;
    }

    /**
     * @method move
     * @description Перемещает путь и все его кривые.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    move(dx, dy) {
        this.setPosition(this.x + dx, this.y + dy);
    }
}
