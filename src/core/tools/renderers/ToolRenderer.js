/**
 * @class ToolRenderer
 * @abstract
 * @description Базовый класс для рендереров инструментов.
 */
export class ToolRenderer {
    /**
     * @param {ToolOverlay} overlay - Оверлей для визуального представления.
     */
    constructor(overlay) {
        if (this.constructor === ToolRenderer) {
            throw new Error('ToolRenderer is an abstract class');
        }
        this.overlay = overlay;
        this.tool = null;
    }

    /**
     * @method setTool
     * @description Устанавливает инструмент для рендерера.
     * @param {Tool} tool - Инструмент для рендеринга.
     */
    setTool(tool) {
        this.tool = tool;
    }

    /**
     * @method render
     * @description Рендерит визуальное представление инструмента.
     */
    render() {
        if (!this.tool) {
            throw new Error('Tool is not set');
        }
        this.renderTool();
    }

    /**
     * @method renderTool
     * @abstract
     * @protected
     * @description Рендерит конкретное визуальное представление инструмента.
     */
    renderTool() {
        throw new Error('Method renderTool() must be implemented');
    }

    /**
     * @method clear
     * @description Очищает визуальное представление инструмента.
     */
    clear() {}

    /**
     * @method transformPoint
     * @protected
     * @description Преобразует координаты из пространства SVG в экранные координаты.
     */
    transformPoint(x, y, matrix, containerRect) {
        const point = new DOMPoint(x, y).matrixTransform(matrix);
        return {
            x: point.x - containerRect.left,
            y: point.y - containerRect.top,
        };
    }

    /**
     * @method calculateElementPosition
     * @protected
     * @description Вычисляет позицию и размеры элемента оверлея.
     */
    calculateElementPosition(node, container) {
        const bbox = node.getBBox();
        const nodePosition = node.getAbsolutePosition();
        const svgMatrix = container.querySelector('svg').getScreenCTM();
        const rect = container.getBoundingClientRect();

        const absoluteX = nodePosition.x + bbox.x;
        const absoluteY = nodePosition.y + bbox.y;

        const screenPoint = this.transformPoint(absoluteX, absoluteY, svgMatrix, rect);

        const scale = svgMatrix.a;
        const width = bbox.width * scale;
        const height = bbox.height * scale;

        return {
            x: screenPoint.x,
            y: screenPoint.y,
            width,
            height,
        };
    }
}
