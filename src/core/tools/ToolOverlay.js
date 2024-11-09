import { CanvasEvents } from '../events/CanvasEvents.js';
import { AppContext } from '../AppContext.js';

/**
 * @class ToolOverlay
 * @description Класс для визуального представления инструментов над холстом.
 */
export class ToolOverlay {
    constructor() {
        const app = AppContext.getApp();
        this.container = app.container;
        this.overlay = null;
        this.tools = new Set();
        this.elements = new Map();
        this.init();
        this.bindEvents();
    }

    /**
     * @method init
     * @private
     * @description Инициализирует оверлей.
     */
    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tool-overlay';
        this.container.appendChild(this.overlay);
    }

    /**
     * @method bindEvents
     * @private
     * @description Привязывает обработчики событий.
     */
    bindEvents() {
        this.container.addEventListener(CanvasEvents.TRANSFORM, this.handleCanvasEvent.bind(this));
        this.container.addEventListener(CanvasEvents.ZOOM, this.handleCanvasEvent.bind(this));
        this.container.addEventListener(CanvasEvents.RESIZE, this.handleResize.bind(this));
    }

    /**
     * @method handleCanvasEvent
     * @private
     * @description Обрабатывает события изменения холста.
     */
    handleCanvasEvent() {
        this.tools.forEach(tool => {
            if (tool.active) {
                tool.updateVisuals();
            }
        });
    }

    /**
     * @method handleResize
     * @private
     * @description Обрабатывает событие изменения размера холста.
     * @param {CustomEvent} e - Событие изменения размера.
     */
    handleResize(e) {
        this.overlay.style.width = `${e.detail.width}px`;
        this.overlay.style.height = `${e.detail.height}px`;
        this.handleCanvasEvent();
    }

    /**
     * @method registerTool
     * @description Регистрирует инструмент для отображения.
     * @param {Tool} tool - Инструмент для регистрации.
     */
    registerTool(tool) {
        this.tools.add(tool);
    }

    /**
     * @method unregisterTool
     * @description Удаляет регистрацию инструмента.
     * @param {Tool} tool - Инструмент для удаления.
     */
    unregisterTool(tool) {
        this.tools.delete(tool);
    }

    /**
     * @method createElement
     * @description Создает новый элемент оверлея.
     * @param {string} id - Идентификатор элемента.
     * @param {string} className - CSS класс элемента.
     * @returns {HTMLElement} Созданный элемент.
     */
    createElement(id, className) {
        let element = this.elements.get(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            element.className = className;
            this.overlay.appendChild(element);
            this.elements.set(id, element);
        }
        return element;
    }

    /**
     * @method removeElement
     * @description Удаляет элемент оверлея.
     * @param {string} id - Идентификатор элемента.
     */
    removeElement(id) {
        const element = this.elements.get(id);
        if (element) {
            element.remove();
            this.elements.delete(id);
        }
    }

    /**
     * @method updateElementPosition
     * @description Обновляет позицию элемента оверлея.
     * @param {string} id - Идентификатор элемента.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     */
    updateElementPosition(id, x, y) {
        const element = this.elements.get(id);
        if (element) {
            element.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    /**
     * @method clear
     * @description Очищает все элементы оверлея.
     */
    clear() {
        this.tools.clear();
        this.elements.forEach(element => element.remove());
        this.elements.clear();
        this.overlay.innerHTML = '';
    }

    /**
     * @method dispose
     * @description Удаляет оверлей и очищает ресурсы.
     */
    dispose() {
        this.container.removeEventListener(CanvasEvents.TRANSFORM, this.handleCanvasEvent);
        this.container.removeEventListener(CanvasEvents.ZOOM, this.handleCanvasEvent);
        this.container.removeEventListener(CanvasEvents.RESIZE, this.handleResize);
        this.clear();
        this.overlay.remove();
    }
}
