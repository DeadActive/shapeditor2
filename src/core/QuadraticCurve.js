import { Curve } from './Curve.js';
import { Point } from './Point.js';

/**
 * @class QuadraticCurve
 * @extends Curve
 * @description Представляет квадратичную кривую Безье.
 */
export class QuadraticCurve extends Curve {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя кривой.
     * @param {Point} start - Начальная точка.
     * @param {Point} control - Контрольная точка.
     * @param {Point} end - Конечная точка.
     */
    constructor(id, name, start, control, end) {
        super(id, name, 'quadratic');
        this.addChild(start);
        this.addChild(control);
        this.addChild(end);
    }

    /**
     * @method clone
     * @override
     * @description Создает глубокую копию кривой.
     * @param {string} [newId] - Новый идентификатор для клона.
     * @returns {QuadraticCurve} Клонированная кривая.
     */
    clone(newId = null) {
        const [start, control, end] = this.children.map(point => point.clone());
        return new QuadraticCurve(newId || `${this.id}_clone`, `${this.name} (clone)`, start, control, end);
    }

    /**
     * @method getPoints
     * @description Возвращает точки кривой.
     * @returns {Object} Объект с точками кривой.
     */
    getPoints() {
        return {
            start: this.children[0],
            control: this.children[1],
            end: this.children[2],
        };
    }

    /**
     * @method getPointAt
     * @description Возвращает точку на кривой для заданного параметра t.
     * @param {number} t - Параметр от 0 до 1.
     * @returns {Object} Координаты точки.
     */
    getPointAt(t) {
        const { start, control, end } = this.getPoints();
        const x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * control.x + Math.pow(t, 2) * end.x;
        const y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * control.y + Math.pow(t, 2) * end.y;
        return { x, y };
    }

    /**
     * @method _getBaseSVGPathData
     * @protected
     * @description Возвращает базовую строку для атрибута d SVG-пути без закрытия.
     * @param {boolean} [isFirst=true] - Является ли кривая первой в пути.
     * @returns {string} Ст��ока для атрибута d.
     */
    _getBaseSVGPathData(isFirst = true) {
        const { start, control, end } = this.getPoints();
        const startPos = start.getAbsolutePosition();
        const controlPos = control.getAbsolutePosition();
        const endPos = end.getAbsolutePosition();

        const moveCommand = isFirst ? `M ${startPos.x} ${startPos.y}` : '';
        return `${moveCommand} Q ${controlPos.x} ${controlPos.y}, ${endPos.x} ${endPos.y}`;
    }
}
