import { CanvasResizeCommand } from '../../core/commands/CanvasCommands.js';
import { CanvasEvents } from '../../core/events/CanvasEvents.js';
import { AppContext } from '../../core/AppContext.js';

/**
 * @class ResizeHandler
 * @description Обработчик событий изменения размера холста.
 */
export class ResizeHandler {
    constructor() {
        this.resizeTimeout = null;
        this.canvasResize = null;

        // Привязываем контекст
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        this.canvasResize = new CanvasResizeCommand(AppContext.getApp().tree.root);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        const app = AppContext.getApp();
        const { clientWidth, clientHeight } = app.container;
        this.canvasResize.addResize(clientWidth, clientHeight);

        // Emit resize event
        const event = new CustomEvent(CanvasEvents.RESIZE, {
            detail: { width: clientWidth, height: clientHeight },
        });
        app.container.dispatchEvent(event);

        this.resizeTimeout = setTimeout(() => {
            app.tree.executeCommand(this.canvasResize);
            this.canvasResize = new CanvasResizeCommand(app.tree.root);
        }, 300);
    }

    dispose() {
        window.removeEventListener('resize', this.handleResize);
    }
}
