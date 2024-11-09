import { AccumulatedZoomCommand } from '../../core/commands/CanvasCommands.js';
import { CanvasEvents } from '../../core/events/CanvasEvents.js';
import { AppContext } from '../../core/AppContext.js';

/**
 * @class ZoomHandler
 * @description Обработчик событий масштабирования холста.
 */
export class ZoomHandler {
    constructor() {
        this.minZoom = 0.1;
        this.maxZoom = 10;
        this.zoomFactor = 1.1;
        this.accumulatedZoom = null;
        this.wheelTimeout = null;

        // Привязываем контекст
        this.handleWheel = this.handleWheel.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    init() {
        const { container } = AppContext.getApp();
        container.addEventListener('wheel', this.handleWheel, { passive: false });
        container.addEventListener('touchstart', this.handleTouchStart);
        container.addEventListener('touchmove', this.handleTouchMove);
        container.addEventListener('touchend', this.handleTouchEnd);

        this.accumulatedZoom = new AccumulatedZoomCommand(AppContext.getApp().tree.root);
    }

    handleWheel(e) {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();

        const rect = AppContext.getApp().container.getBoundingClientRect();
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;

        const delta = e.deltaY > 0 ? 1 / this.zoomFactor : this.zoomFactor;
        this.addZoom(delta, centerX, centerY);

        // Очищаем предыдущий таймаут
        if (this.wheelTimeout) {
            clearTimeout(this.wheelTimeout);
        }

        // Устанавливаем новый таймаут для завершения зума
        this.wheelTimeout = setTimeout(() => {
            this.finishZoom();
        }, 200);

        AppContext.getApp().uiManager.renderer.update();
    }

    finishZoom() {
        if (this.accumulatedZoom) {
            AppContext.getApp().tree.executeCommand(this.accumulatedZoom);
            this.accumulatedZoom = new AccumulatedZoomCommand(AppContext.getApp().tree.root);
        }
    }

    handleTouchStart(e) {
        if (e.touches.length !== 2) return;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        this.lastPinchDistance = this.getPinchDistance(touch1, touch2);
    }

    handleTouchMove(e) {
        if (e.touches.length !== 2) return;
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = this.getPinchDistance(touch1, touch2);

        if (this.lastPinchDistance) {
            const delta = currentDistance / this.lastPinchDistance;
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;

            this.addZoom(delta, centerX, centerY);
        }

        this.lastPinchDistance = currentDistance;
        AppContext.getApp().uiManager.renderer.update();
    }

    handleTouchEnd() {
        if (this.lastPinchDistance !== null) {
            this.lastPinchDistance = null;
            // Завершаем накопление зума и добавляем команду в историю
            AppContext.getApp().tree.executeCommand(this.accumulatedZoom);
            this.accumulatedZoom = new AccumulatedZoomCommand(AppContext.getApp().tree.root);
        }
    }

    getPinchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    addZoom(scale, centerX, centerY) {
        // Проверяем пределы масштабирования
        const currentScale = this.accumulatedZoom.totalScale * scale;
        if (currentScale < this.minZoom || currentScale > this.maxZoom) {
            return;
        }

        this.accumulatedZoom.addZoom(scale, centerX, centerY);

        // Emit zoom event
        const event = new CustomEvent(CanvasEvents.ZOOM, {
            detail: { scale, centerX, centerY },
        });
        AppContext.getApp().container.dispatchEvent(event);
    }

    dispose() {
        const { container } = AppContext.getApp();
        container.removeEventListener('wheel', this.handleWheel);
        container.removeEventListener('touchstart', this.handleTouchStart);
        container.removeEventListener('touchmove', this.handleTouchMove);
        container.removeEventListener('touchend', this.handleTouchEnd);
    }
}
