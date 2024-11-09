import { Tool } from './Tool.js';
import { HitTesting } from '../HitTesting.js';
import { SelectionToolRenderer } from './renderers/SelectionToolRenderer.js';
import { AppContext } from '../AppContext.js';

/**
 * @class SelectionTool
 * @extends Tool
 * @description Инструмент для выделения узлов.
 */
export class SelectionTool extends Tool {
    /**
     * @param {ToolOverlay} overlay - Оверлей для визуального представления.
     */
    constructor(overlay) {
        const app = AppContext.getApp();
        super(app, overlay);
        this.hitTesting = new HitTesting(app.tree);
    }

    /**
     * @method createRenderer
     * @description Создает рендерер для инструмента выделения.
     * @param {ToolOverlay} overlay - Оверлей для визуального представления.
     * @returns {SelectionToolRenderer} Рендерер инструмента выделения.
     */
    createRenderer(overlay) {
        return new SelectionToolRenderer(overlay);
    }

    addEventListeners() {
        const { container } = AppContext.getApp();
        container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    removeEventListeners() {
        const { container } = AppContext.getApp();
        container.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        container.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleMouseDown(e) {
        if (!this.active) return;

        const node = this.hitTesting.getTopNodeAtPoint(e.clientX, e.clientY);
        AppContext.getApp().setActiveNode(node);
        this.updateVisuals();
    }

    handleKeyDown(e) {
        if (!this.active) return;

        if (e.key === 'Escape') {
            AppContext.getApp().setActiveNode(null);
            this.updateVisuals();
        }
    }
}
