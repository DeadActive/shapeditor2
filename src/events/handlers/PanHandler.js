import { CanvasTransformCommand } from '../../core/commands/CanvasCommands.js';
import { CanvasEvents } from '../../core/events/CanvasEvents.js';
import { AppContext } from '../../core/AppContext.js';

/**
 * @class PanHandler
 * @description Обработчик событий панорамирования холста.
 */
export class PanHandler {
    constructor() {
        this.isDragging = false;
        this.isSpacePressed = false;
        this.lastX = 0;
        this.lastY = 0;
        this.canvasTransform = null;
        this.scrollSpeed = 1;
        this.wheelTimeout = null;

        // Привязываем контекст
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    init() {
        const { container } = AppContext.getApp();
        container.addEventListener('mousedown', this.handleMouseDown);
        container.addEventListener('mousemove', this.handleMouseMove);
        container.addEventListener('mouseup', this.handleMouseUp);
        container.addEventListener('wheel', this.handleWheel);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(e) {
        if (e.code === 'Space' && !this.isSpacePressed) {
            this.isSpacePressed = true;
            document.body.style.cursor = 'grab';
            if (this.isDragging) {
                document.body.style.cursor = 'grabbing';
            }
        }
    }

    handleKeyUp(e) {
        if (e.code === 'Space') {
            this.isSpacePressed = false;
            document.body.style.cursor = '';
            if (this.isDragging) {
                this.isDragging = false;
                if (this.canvasTransform) {
                    AppContext.getApp().tree.executeCommand(this.canvasTransform);
                    this.canvasTransform = null;
                }
            }
        }
    }

    handleMouseDown(e) {
        // Проверяем, что это основная кнопка мыши и нажат пробел
        if (e.button !== 0 || !this.isSpacePressed) return;

        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        document.body.style.cursor = 'grabbing';
        this.canvasTransform = new CanvasTransformCommand(AppContext.getApp().tree.root);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const dx = -(e.clientX - this.lastX);
        const dy = -(e.clientY - this.lastY);
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.canvasTransform.addTransform(dx, dy);
        AppContext.getApp().tree.root.markDirty();

        // Emit transform event
        const event = new CustomEvent(CanvasEvents.TRANSFORM, {
            detail: { dx, dy },
        });
        AppContext.getApp().container.dispatchEvent(event);

        AppContext.getApp().uiManager.renderer.update();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = this.isSpacePressed ? 'grab' : '';
            if (this.canvasTransform) {
                AppContext.getApp().tree.executeCommand(this.canvasTransform);
                this.canvasTransform = null;
            }
        }
    }

    handleWheel(e) {
        // Если зажат Ctrl или Meta, не обрабатываем (это для зума)
        if (e.ctrlKey || e.metaKey) return;

        e.preventDefault();

        let dx = 0;
        let dy = 0;

        // Обработка горизонтального скролла
        if (e.shiftKey) {
            // Shift + вертикальное колесо = горизонтальный скролл
            dx = e.deltaY * this.scrollSpeed;
        } else if (e.deltaX !== 0) {
            // Нативный горизонтальный скролл (тачпад Mac)
            dx = e.deltaX * this.scrollSpeed;
            dy = e.deltaY * this.scrollSpeed;
        } else {
            // Обычный вертикальный скролл
            dy = e.deltaY * this.scrollSpeed;
        }

        // Создаем или используем существующую команду для накопления
        if (!this.canvasTransform) {
            this.canvasTransform = new CanvasTransformCommand(AppContext.getApp().tree.root);
        }

        this.canvasTransform.addTransform(dx, dy);

        // Emit transform event
        const event = new CustomEvent(CanvasEvents.TRANSFORM, {
            detail: { dx, dy },
        });
        AppContext.getApp().container.dispatchEvent(event);

        // Обновляем рендер
        AppContext.getApp().tree.root.markDirty();
        AppContext.getApp().uiManager.renderer.update();

        // Сбрасываем предыдущий таймаут
        if (this.wheelTimeout) {
            clearTimeout(this.wheelTimeout);
        }

        // Устанавливаем новый таймаут для завершения скролла
        this.wheelTimeout = setTimeout(() => {
            if (this.canvasTransform) {
                AppContext.getApp().tree.executeCommand(this.canvasTransform);
                this.canvasTransform = null;
            }
            this.wheelTimeout = null;
        }, 200);
    }

    dispose() {
        const { container } = AppContext.getApp();
        container.removeEventListener('mousedown', this.handleMouseDown);
        container.removeEventListener('mousemove', this.handleMouseMove);
        container.removeEventListener('mouseup', this.handleMouseUp);
        container.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);

        if (this.wheelTimeout) {
            clearTimeout(this.wheelTimeout);
        }
    }
}
