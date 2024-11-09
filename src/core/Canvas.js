import { Node } from './Node.js';

/**
 * @class Canvas
 * @extends Node
 * @description Представляет корневой узел для SVG-элемента.
 */
export class Canvas extends Node {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя узла.
     * @param {number} width - Ширина холста.
     * @param {number} height - Высота холста.
     */
    constructor(id, name, width = 800, height = 600) {
        super(id, name, 'canvas');
        this.width = width;
        this.height = height;
        this.viewBox = { x: 0, y: 0, width, height };
        this.backgroundColor = 'transparent';
    }

    /**
     * @method setSize
     * @description Устанавливает размеры холста.
     * @param {number} width - Новая ширина.
     * @param {number} height - Новая высота.
     */
    setSize(width, height) {
        this.updateProperty('width', width);
        this.updateProperty('height', height);
    }

    /**
     * @method setViewBox
     * @description Устанавливае�� область просмотра SVG.
     * @param {number} x - Координата X начала области просмотра.
     * @param {number} y - Координата Y начала области просмотра.
     * @param {number} width - Ширина области просмотра.
     * @param {number} height - Высота области просмотра.
     */
    setViewBox(x, y, width, height) {
        this.updateProperty('viewBox', { x, y, width, height });
    }

    /**
     * @method setBackgroundColor
     * @description Устанавливает цвет фона холста.
     * @param {string} color - Цвет фона.
     */
    setBackgroundColor(color) {
        this.updateProperty('backgroundColor', color);
    }

    /**
     * @method getViewBoxString
     * @description Возвращает строку viewBox для SVG-элемента.
     * @returns {string} Строка viewBox.
     */
    getViewBoxString() {
        const { x, y, width, height } = this.viewBox;
        return `${x} ${y} ${width} ${height}`;
    }

    /**
     * @method pan
     * @description Перемещает область просмотра.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    pan(dx, dy) {
        const newViewBox = {
            ...this.viewBox,
            x: this.viewBox.x + dx,
            y: this.viewBox.y + dy,
        };
        this.updateProperty('viewBox', newViewBox);
    }

    /**
     * @method zoom
     * @description Масштабирует область просмотра относительно центра.
     * @param {number} scale - Коэффициент масштабирования.
     * @param {number} centerX - Центр масштабирования по X.
     * @param {number} centerY - Центр масштабирования по Y.
     */
    zoom(scale, centerX, centerY) {
        const newWidth = this.viewBox.width / scale;
        const newHeight = this.viewBox.height / scale;
        const newX = centerX - (centerX - this.viewBox.x) / scale;
        const newY = centerY - (centerY - this.viewBox.y) / scale;

        this.setViewBox(newX, newY, newWidth, newHeight);
    }

    /**
     * @method getSVGAttributes
     * @description Возвращает атрибуты для SVG-элемента.
     * @returns {Object} Объект с атрибутами.
     */
    getSVGAttributes() {
        return {
            width: this.width,
            height: this.height,
            viewBox: this.getViewBoxString(),
            style: `background-color: ${this.backgroundColor};`,
        };
    }
}
