import { ToolRenderer } from './ToolRenderer.js';

/**
 * @class SelectionToolRenderer
 * @extends ToolRenderer
 * @description Рендерер для инструмента выделения.
 */
export class SelectionToolRenderer extends ToolRenderer {
    constructor(overlay) {
        super(overlay);
        this.selectionId = 'selection-border';
    }

    /**
     * @method renderTool
     * @description Рендерит границу выделения.
     */
    renderTool() {
        const selectedNode = this.tool.app.activeNode;
        if (!selectedNode) {
            this.clear();
            return;
        }

        let element = this.overlay.createElement(this.selectionId, 'selection-border');
        const position = this.calculateElementPosition(selectedNode, this.tool.app.container);

        element.style.width = `${position.width}px`;
        element.style.height = `${position.height}px`;
        this.overlay.updateElementPosition(this.selectionId, position.x, position.y);
    }

    /**
     * @method clear
     * @description Очищает границу выделения.
     */
    clear() {
        this.overlay.removeElement(this.selectionId);
    }
}
