import { Panel } from './Panel.js';
import { CanvasEvents } from '../core/events/CanvasEvents.js';
import { AppContext } from '../core/AppContext.js';

/**
 * @class ViewportPanel
 * @extends Panel
 * @description UI панель для отображения информации о viewport холста.
 */
export class ViewportPanel extends Panel {
    constructor() {
        super('Viewport', 'viewport-panel');
        this.infoContainer = null;
    }

    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем контейнер для информации
        this.infoContainer = document.createElement('div');
        this.infoContainer.className = 'viewport-info';

        // Добавляем контейнер в панель
        this.content.appendChild(this.infoContainer);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Подписываемся на события изменения viewport
        const container = AppContext.getApp().container;
        container.addEventListener(CanvasEvents.TRANSFORM, () => this.updateViewportInfo());
        container.addEventListener(CanvasEvents.ZOOM, () => this.updateViewportInfo());
        container.addEventListener(CanvasEvents.RESIZE, () => this.updateViewportInfo());

        // Первичное обновление
        this.updateViewportInfo();

        // Восстанавливаем состояние сворачивания
        this.restoreState();
    }

    /**
     * @method updateViewportInfo
     * @private
     * @description Обновляет информацию о viewport.
     */
    updateViewportInfo() {
        const canvas = AppContext.getApp().tree.root;
        const viewBox = canvas.viewBox;
        const scale = canvas.width / viewBox.width;

        this.infoContainer.innerHTML = `
            <div class="viewport-row">
                <span class="viewport-label">Position:</span>
                <span class="viewport-value">x: ${viewBox.x.toFixed(2)}, y: ${viewBox.y.toFixed(2)}</span>
            </div>
            <div class="viewport-row">
                <span class="viewport-label">Size:</span>
                <span class="viewport-value">w: ${viewBox.width.toFixed(2)}, h: ${viewBox.height.toFixed(2)}</span>
            </div>
            <div class="viewport-row">
                <span class="viewport-label">Scale:</span>
                <span class="viewport-value">${scale.toFixed(2)}x</span>
            </div>
        `;
    }
}
