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
     * @method clone
     * @override
     * @description Создает глубокую копию пути.
     * @param {string} [newId] - Новый идентификатор для клона.
     * @returns {Path} Клонированный путь.
     */
    clone(newId = null) {
        const clone = new Path(newId || `${this.id}_clone`, `${this.name} (clone)`);

        // Копируем стили и состояние
        clone.closed = this.closed;
        clone.strokeColor = this.strokeColor;
        clone.strokeWidth = this.strokeWidth;
        clone.fillColor = this.fillColor;
        clone.x = this.x;
        clone.y = this.y;

        // Рекурсивно клонируем дочерние узлы
        this.children.forEach(child => {
            const childClone = child.clone();
            clone.addChild(childClone);
        });

        return clone;
    }

    /**
     * @method getBBox
     * @description Возвращает относительный ограничивающий прямоугольник пути.
     * @returns {{x: number, y: number, width: number, height: number}} Ограничивающий прямоугольник.
     */
    getBBox() {
        if (this.children.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        // Проходим по всем кривым и собираем точки
        this.children.forEach(curve => {
            const points = curve.getPoints();
            Object.values(points).forEach(point => {
                const position = point.getAbsolutePosition();
                minX = Math.min(minX, position.x);
                minY = Math.min(minY, position.y);
                maxX = Math.max(maxX, position.x);
                maxY = Math.max(maxY, position.y);

                // Для кривых также проверяем промежуточные точки
                if (curve.type === 'cubic' || curve.type === 'quadratic') {
                    // Проверяем 10 промежуточных точек на кривой
                    for (let t = 0.1; t < 1; t += 0.1) {
                        const pos = curve.getPointAt(t);
                        minX = Math.min(minX, pos.x);
                        minY = Math.min(minY, pos.y);
                        maxX = Math.max(maxX, pos.x);
                        maxY = Math.max(maxY, pos.y);
                    }
                }
            });
        });

        // Учитываем толщину обводки
        const strokeOffset = this.strokeWidth / 2;
        minX -= strokeOffset;
        minY -= strokeOffset;
        maxX += strokeOffset;
        maxY += strokeOffset;

        // Вычисляем относительные координаты к родителю
        const parentPos = this.parent ? this.parent.getAbsolutePosition() : { x: 0, y: 0 };
        const relativeX = minX - parentPos.x;
        const relativeY = minY - parentPos.y;

        return {
            x: relativeX,
            y: relativeY,
            width: maxX - minX,
            height: maxY - minY,
        };
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
