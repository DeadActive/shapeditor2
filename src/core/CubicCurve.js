import { Curve } from './Curve.js';

/**
 * @class CubicCurve
 * @extends Curve
 * @description Представляет кубическую кривую Безье.
 */
export class CubicCurve extends Curve {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя кривой.
     * @param {Point} startPoint - Начальная точка.
     * @param {Point} control1Point - Первая контрольная точка.
     * @param {Point} control2Point - Вторая контрольная точка.
     * @param {Point} endPoint - Конечная точка.
     */
    constructor(id, name, startPoint, control1Point, control2Point, endPoint) {
        super(id, name, 'cubic');
        this.addChild(startPoint);
        this.addChild(control1Point);
        this.addChild(control2Point);
        this.addChild(endPoint);
    }

    /**
     * @method getPoints
     * @description Возвращает точки кривой.
     * @returns {Object} Объект с точками кривой.
     */
    getPoints() {
        return {
            start: this.children[0],
            control1: this.children[1],
            control2: this.children[2],
            end: this.children[3],
        };
    }

    /**
     * @method getPointAt
     * @description Возвращает точку на кривой для заданного параметра t.
     * @param {number} t - Параметр от 0 до 1.
     * @returns {Object} Координаты точки.
     */
    getPointAt(t) {
        const { start, control1, control2, end } = this.getPoints();
        const x =
            Math.pow(1 - t, 3) * start.x +
            3 * Math.pow(1 - t, 2) * t * control1.x +
            3 * (1 - t) * Math.pow(t, 2) * control2.x +
            Math.pow(t, 3) * end.x;
        const y =
            Math.pow(1 - t, 3) * start.y +
            3 * Math.pow(1 - t, 2) * t * control1.y +
            3 * (1 - t) * Math.pow(t, 2) * control2.y +
            Math.pow(t, 3) * end.y;
        return { x, y };
    }

    /**
     * @method _getBaseSVGPathData
     * @protected
     * @description Возвращает базовую строку для атрибута d SVG-пути без закрытия.
     * @param {boolean} [isFirst=true] - Является ли кривая первой в пути.
     * @returns {string} Строка для атрибута d.
     */
    _getBaseSVGPathData(isFirst = true) {
        const { start, control1, control2, end } = this.getPoints();
        const startPos = start.getAbsolutePosition();
        const control1Pos = control1.getAbsolutePosition();
        const control2Pos = control2.getAbsolutePosition();
        const endPos = end.getAbsolutePosition();

        const moveCommand = isFirst ? `M ${startPos.x} ${startPos.y}` : '';
        return `${moveCommand} C ${control1Pos.x} ${control1Pos.y}, ${control2Pos.x} ${control2Pos.y}, ${endPos.x} ${endPos.y}`;
    }
}
