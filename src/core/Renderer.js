/**
 * @class Renderer
 * @description Класс для рендеринга дерева узлов в DOM с использованием requestAnimationFrame.
 */
export class Renderer {
    /**
     * @param {Tree} tree - Дерево для рендеринга.
     * @param {HTMLElement} container - DOM элемент-контейнер для SVG.
     */
    constructor(tree, container) {
        this.tree = tree;
        this.container = container;
        this.svgElement = null;
        this.pathElements = new Map(); // Кэш элементов для быстрого доступа
        this.animationFrameId = null;
        this.isRenderScheduled = false;
    }

    /**
     * @method init
     * @description Инициализирует рендерер, создает SVG элемент.
     */
    init() {
        const canvas = this.tree.root;
        if (canvas.type !== 'canvas') {
            throw new Error('Root node must be Canvas');
        }

        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.updateCanvasAttributes();
        this.container.appendChild(this.svgElement);

        // Устанавливаем себя как рендерер для дерева
        this.tree.setRenderer(this);
    }

    /**
     * @method updateCanvasAttributes
     * @description Обновляет атрибуты SVG элемента на основе Canvas node.
     */
    updateCanvasAttributes() {
        const canvas = this.tree.root;
        const attrs = canvas.getSVGAttributes();

        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'style') {
                this.svgElement.style.cssText = value;
            } else {
                this.svgElement.setAttribute(key, value);
            }
        });
    }

    /**
     * @method render
     * @description Рендерит или обновляет только измененные пути.
     */
    render() {
        if (!this.svgElement) {
            this.init();
        }

        // Обновляем атрибуты холста если он изменился
        if (this.tree.root.dirty) {
            this.updateCanvasAttributes();
        }

        // Получаем текущие пути
        const currentPaths = new Set();
        this.tree.root.children.forEach(path => {
            if (path.type === 'path') {
                currentPaths.add(path.id);
                if (path.dirty) {
                    this.renderPath(path);
                }
            }
        });

        // Удаляем пути, которых больше нет в дереве
        this.pathElements.forEach((element, id) => {
            if (!currentPaths.has(id)) {
                element.remove();
                this.pathElements.delete(id);
            }
        });

        // Обновляем z-index путей
        this.updatePathsOrder();
    }

    /**
     * @method updatePathsOrder
     * @description Обновляет порядок отрисовки путей в SVG.
     * @private
     */
    updatePathsOrder() {
        this.tree.root.children.forEach(path => {
            if (path.type === 'path') {
                const element = this.pathElements.get(path.id);
                if (element) {
                    this.svgElement.appendChild(element); // Перемещаем в конец, что соответствует верхнему z-index
                }
            }
        });
    }

    /**
     * @method renderPath
     * @description Рендерит или обновляет отдельный путь.
     * @param {Path} path - Путь для рендеринга.
     */
    renderPath(path) {
        let pathElement = this.pathElements.get(path.id);
        console.log('renderPath', path.id);

        if (!pathElement) {
            pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('id', path.id);
            this.svgElement.appendChild(pathElement);
            this.pathElements.set(path.id, pathElement);
        }

        // Обновляем атрибуты пути
        pathElement.setAttribute('d', path.getSVGPathData());
        pathElement.setAttribute('stroke', path.strokeColor);
        pathElement.setAttribute('stroke-width', path.strokeWidth);
        pathElement.setAttribute('fill', path.fillColor);

        // Применяем трансформацию если путь имеет смещение
        const position = path.getAbsolutePosition();
        if (position.x !== 0 || position.y !== 0) {
            pathElement.setAttribute('transform', `translate(${position.x} ${position.y})`);
        } else {
            pathElement.removeAttribute('transform');
        }
    }

    /**
     * @method update
     * @description Планирует обновление рендера на следующем frame.
     */
    update() {
        if (!this.isRenderScheduled) {
            this.isRenderScheduled = true;
            this.animationFrameId = requestAnimationFrame(() => this.renderIfNeeded());
        }
    }

    /**
     * @method renderIfNeeded
     * @description Проверяет необходимость обновления и выполняет рендер при наличии изменений.
     * @private
     */
    renderIfNeeded() {
        this.isRenderScheduled = false;

        // Проверяем, есть ли грязные узлы в дереве
        if (this.hasChanges(this.tree.root)) {
            this.render();
            this.tree.update(); // Очищаем флаги dirty
        }
    }

    /**
     * @method hasChanges
     * @description Проверяет наличие изменений в узле и его потомках.
     * @param {Node} node - Узел для проверки.
     * @returns {boolean} Есть ли изменения.
     * @private
     */
    hasChanges(node) {
        let hasChanges = false;
        this.tree.traverse(
            node => {
                hasChanges = true;
            },
            node,
            { skipDirtyCheck: false }
        );
        return hasChanges;
    }

    /**
     * @method clear
     * @description Очищает рендер.
     */
    clear() {
        if (this.svgElement) {
            this.svgElement.remove();
            this.svgElement = null;
        }
        this.pathElements.clear();
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы рендерера.
     */
    dispose() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.clear();
        this.tree = null;
        this.container = null;
    }
}
