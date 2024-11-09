import { Panel } from './Panel.js';
import { AppContext } from '../core/AppContext.js';

/**
 * @class TreePanel
 * @extends Panel
 * @description UI панель для отображения иерархии узлов дерева.
 */
export class TreePanel extends Panel {
    constructor() {
        super('Tree', 'tree-panel');
        this.treeContainer = null;
        this.collapsedNodes = new Set(); // Сохраняем состояния свёрнутых узлов
    }

    /**
     * @method init
     * @description Инициализирует панель дерева.
     */
    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем контейнер для дерева
        this.treeContainer = document.createElement('div');
        this.treeContainer.className = 'tree-container';

        // Добавляем контейнер в панель
        this.content.appendChild(this.treeContainer);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Подписываемся на обновления дерева
        AppContext.getApp().tree.setHistoryUpdateCallback(() => {
            if (!this.isCollapsed) {
                this.updateTree();
            }
        });

        // Обновляем отображение дерева
        if (!this.isCollapsed) {
            this.updateTree();
        }

        // Восстанавливаем состояние сворачивания
        this.restoreState();
    }

    /**
     * @method toggleCollapse
     * @override
     * @description Переопределяем метод сворачивания панели.
     */
    toggleCollapse() {
        super.toggleCollapse();

        // Если панель разворачивается, обновляем дерево
        if (!this.isCollapsed) {
            this.updateTree();
        }
    }

    /**
     * @method updateTree
     * @description Обновляет отображение дерева.
     */
    updateTree() {
        // Пропускаем обновление если панель свёрнута
        if (this.isCollapsed) return;

        // Сохраняем состояния свёрнутых узлов перед обновлением
        this.saveCollapseStates(this.treeContainer);

        this.treeContainer.innerHTML = '';
        this.renderNode(AppContext.getApp().tree.root, this.treeContainer, 0);
    }

    /**
     * @method saveCollapseStates
     * @private
     * @description Сохраняет состояния свёрнутых узлов.
     * @param {HTMLElement} container - Контейнер для проверки.
     */
    saveCollapseStates(container) {
        if (!container) return;

        const nodes = container.querySelectorAll('.tree-node');
        nodes.forEach(node => {
            const children = node.querySelector('.tree-node-children');
            if (children && children.style.display === 'none') {
                const nodeId = node.dataset.nodeId;
                if (nodeId) {
                    this.collapsedNodes.add(nodeId);
                }
            }
        });
    }

    /**
     * @method renderNode
     * @private
     * @description Рендерит узел дерева и его потомков.
     * @param {Node} node - Узел для рендеринга.
     * @param {HTMLElement} container - Контейнер для узла.
     * @param {number} level - Уровень вложенности.
     */
    renderNode(node, container, level) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.style.paddingLeft = `${level * 5}px`;
        nodeElement.dataset.nodeId = node.id;

        // Создаем заголовок узла
        const header = document.createElement('div');
        header.className = 'tree-node-header';

        let toggle;

        // Добавляем иконку сворачивания если есть дочерние узлы
        if (node.children.length > 0) {
            toggle = document.createElement('span');
            toggle.className = 'tree-node-toggle';
            toggle.textContent = '▼';
            toggle.onclick = e => {
                e.stopPropagation();
                this.toggleNode(nodeElement, toggle, node.id);
            };
            header.appendChild(toggle);
        }

        // Добавляем информацию об узле
        const info = document.createElement('span');
        info.className = 'tree-node-info';
        info.textContent = `${node.name} (${node.type})`;
        if (node === AppContext.getApp().activeNode) {
            info.classList.add('selected');
        }
        header.appendChild(info);

        nodeElement.appendChild(header);

        // Создаем контейнер для дочерних узлов
        if (node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-node-children';
            node.children.forEach(child => {
                this.renderNode(child, childrenContainer, level + 1);
            });
            nodeElement.appendChild(childrenContainer);

            // Восстанавливаем состояние сворачивания
            if (this.collapsedNodes.has(node.id)) {
                childrenContainer.style.display = 'none';
                toggle.style.transform = 'rotate(-90deg)';
            }
        }

        container.appendChild(nodeElement);
    }

    /**
     * @method toggleNode
     * @private
     * @description Сворачивает/разворачивает узел дерева.
     * @param {HTMLElement} nodeElement - Элемент узла.
     * @param {HTMLElement} toggle - Элемент переключателя.
     * @param {string} nodeId - Идентификатор узла.
     */
    toggleNode(nodeElement, toggle, nodeId) {
        const children = nodeElement.querySelector('.tree-node-children');
        const isCollapsed = children.style.display === 'none';

        children.style.display = isCollapsed ? 'block' : 'none';
        toggle.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';

        // Сохраняем состояние сворачивания
        if (isCollapsed) {
            this.collapsedNodes.delete(nodeId);
        } else {
            this.collapsedNodes.add(nodeId);
        }
    }
}
