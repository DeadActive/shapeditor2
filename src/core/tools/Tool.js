/**
 * @class Tool
 * @abstract
 * @description Базовый класс для всех инструментов.
 */
export class Tool {
    /**
     * @param {App} app - Экземпляр приложения.
     * @param {ToolOverlay} overlay - Оверлей для визуального представления.
     */
    constructor(app, overlay) {
        if (this.constructor === Tool) {
            throw new Error('Tool is an abstract class');
        }
        this.app = app;
        this.overlay = overlay;
        this.active = false;
        this.renderer = this.createRenderer(overlay);
        this.renderer.setTool(this);
    }

    /**
     * @method createRenderer
     * @abstract
     * @description Создает рендерер для инструмента.
     * @param {ToolOverlay} overlay - Оверлей для визуального представления.
     * @returns {ToolRenderer} Рендерер инструмента.
     */
    createRenderer(overlay) {
        throw new Error('Method createRenderer() must be implemented');
    }

    /**
     * @method activate
     * @description Активирует инструмент.
     */
    activate() {
        this.active = true;
        this.addEventListeners();
        this.overlay.registerTool(this);
        this.renderer.render();
    }

    /**
     * @method deactivate
     * @description Деактивирует инструмент.
     */
    deactivate() {
        this.active = false;
        this.removeEventListeners();
        this.overlay.unregisterTool(this);
        this.renderer.clear();
    }

    /**
     * @method addEventListeners
     * @abstract
     * @description Добавляет обработчики событий.
     */
    addEventListeners() {
        throw new Error('Method addEventListeners() must be implemented');
    }

    /**
     * @method removeEventListeners
     * @abstract
     * @description Удаляет обработчики событий.
     */
    removeEventListeners() {
        throw new Error('Method removeEventListeners() must be implemented');
    }

    /**
     * @method handleMouseDown
     * @param {MouseEvent} e - Событие мыши.
     */
    handleMouseDown(e) {}

    /**
     * @method handleMouseMove
     * @param {MouseEvent} e - Событие мыши.
     */
    handleMouseMove(e) {}

    /**
     * @method handleMouseUp
     * @param {MouseEvent} e - Событие мыши.
     */
    handleMouseUp(e) {}

    /**
     * @method handleKeyDown
     * @param {KeyboardEvent} e - Событие клавиатуры.
     */
    handleKeyDown(e) {}

    /**
     * @method handleKeyUp
     * @param {KeyboardEvent} e - Событие клавиатуры.
     */
    handleKeyUp(e) {}

    /**
     * @method updateVisuals
     * @description Обновляет визуальное представление инструмента.
     */
    updateVisuals() {
        if (this.active) {
            this.renderer.render();
        }
    }
}
