import { PanHandler } from './handlers/PanHandler.js';
import { ZoomHandler } from './handlers/ZoomHandler.js';
import { ResizeHandler } from './handlers/ResizeHandler.js';
import { App } from '../App.js';
/**
 * @class EventManager
 * @description Управляет всеми обработчиками событий приложения.
 */
export class EventManager {
    /**
     * @param {App} app - Экземпляр приложения.
     */
    constructor(app) {
        this.app = app;
        this.handlers = {
            pan: new PanHandler(this),
            zoom: new ZoomHandler(this),
            resize: new ResizeHandler(this),
        };
    }

    /**
     * @method init
     * @description Инициализирует все обработчики событий.
     */
    init() {
        Object.values(this.handlers).forEach(handler => handler.init());
    }

    /**
     * @method dispose
     * @description Удаляет все обработчики событий.
     */
    dispose() {
        Object.values(this.handlers).forEach(handler => handler.dispose());
    }
}
