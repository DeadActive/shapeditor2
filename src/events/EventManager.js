import { PanHandler } from './handlers/PanHandler.js';
import { ZoomHandler } from './handlers/ZoomHandler.js';
import { ResizeHandler } from './handlers/ResizeHandler.js';

/**
 * @class EventManager
 * @description Управляет обработчиками событий приложения.
 */
export class EventManager {
    constructor() {
        this.panHandler = new PanHandler();
        this.zoomHandler = new ZoomHandler();
        this.resizeHandler = new ResizeHandler();
    }

    init() {
        this.panHandler.init();
        this.zoomHandler.init();
        this.resizeHandler.init();
    }

    dispose() {
        this.panHandler.dispose();
        this.zoomHandler.dispose();
        this.resizeHandler.dispose();
    }
}
