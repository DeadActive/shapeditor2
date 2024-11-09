import { CanvasTransformCommand } from '../../core/commands/CanvasCommands.js';
import { EventManager } from '../EventManager.js';

/**
 * @class PanHandler
 * @description Обработчик событий панорамирования холста.
 */
export class PanHandler {
    /**
     * @param {EventManager} manager - Менеджер событий.
     */
    constructor(manager) {
        this.manager = manager;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.canvasTransform = null;

        // Привязываем контекст
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    init() {
        const { container } = this.manager.app;
        container.addEventListener('mousedown', this.handleMouseDown);
        container.addEventListener('mousemove', this.handleMouseMove);
        container.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown(e) {
        // Проверяем, что это основная кнопка мыши
        if (e.button !== 0) return;

        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.canvasTransform = new CanvasTransformCommand(this.manager.app.tree.root);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const dx = -(e.clientX - this.lastX);
        const dy = -(e.clientY - this.lastY);
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.canvasTransform.addTransform(dx, dy);
        this.manager.app.uiManager.renderer.update();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.manager.app.tree.executeCommand(this.canvasTransform);
            this.canvasTransform = null;
        }
    }

    dispose() {
        const { container } = this.manager.app;
        container.removeEventListener('mousedown', this.handleMouseDown);
        container.removeEventListener('mousemove', this.handleMouseMove);
        container.removeEventListener('mouseup', this.handleMouseUp);
    }
}
