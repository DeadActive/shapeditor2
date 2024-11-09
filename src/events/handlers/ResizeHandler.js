import { CanvasResizeCommand } from '../../core/commands/CanvasCommands.js';

/**
 * @class ResizeHandler
 * @description Обработчик событий изменения размера холста.
 */
export class ResizeHandler {
    /**
     * @param {EventManager} manager - Менеджер событий.
     */
    constructor(manager) {
        this.manager = manager;
        this.resizeTimeout = null;
        this.canvasResize = null;

        // Привязываем контекст
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        this.canvasResize = new CanvasResizeCommand(this.manager.app.tree.root);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        const { clientWidth, clientHeight } = this.manager.app.container;
        this.canvasResize.addResize(clientWidth, clientHeight);

        this.resizeTimeout = setTimeout(() => {
            this.manager.app.tree.executeCommand(this.canvasResize);
            this.canvasResize = new CanvasResizeCommand(this.manager.app.tree.root);
        }, 300);
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
    }
}
