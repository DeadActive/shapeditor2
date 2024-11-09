/**
 * @class HitTesting
 * @description Класс для определения объектов по координатам.
 */
export class HitTesting {
    /**
     * @param {Tree} tree - Дерево узлов.
     */
    constructor(tree) {
        this.tree = tree;
    }

    /**
     * @method getNodesAtPoint
     * @description Возвращает все узлы в заданной точке.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     * @param {string[]} [nodeTypes] - Типы узлов для фильтрации.
     * @returns {Node[]} Массив узлов в точке.
     */
    getNodesAtPoint(x, y, nodeTypes = ['path']) {
        const nodes = [];
        const svg = this.tree.renderer.svgElement;

        // Получаем все элементы в точке
        const elements = document.elementsFromPoint(x, y);

        // Фильтруем только SVG элементы и находим соответствующие узлы
        elements.forEach(element => {
            if (element instanceof SVGElement && element.parentElement === svg) {
                const node = this.tree.traverse(
                    node => {
                        if (nodeTypes.includes(node.type) && node.id === element.id) {
                            nodes.push(node);
                        }
                    },
                    this.tree.root,
                    { skipDirtyCheck: true }
                );
            }
        });

        return nodes;
    }

    /**
     * @method getTopNodeAtPoint
     * @description Возвращает верхний узел в заданной точке.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     * @param {string[]} [nodeTypes] - Типы узлов для фильтрации.
     * @returns {Node|null} Верхний узел или null.
     */
    getTopNodeAtPoint(x, y, nodeTypes = ['path']) {
        const nodes = this.getNodesAtPoint(x, y, nodeTypes);
        return nodes.length > 0 ? nodes[0] : null;
    }
}
