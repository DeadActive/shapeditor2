import { Panel } from './Panel.js';

/**
 * @class PerformancePanel
 * @extends Panel
 * @description UI панель для отображения метрик производительности.
 */
export class PerformancePanel extends Panel {
    constructor() {
        super('Performance', 'performance-panel');
        this.infoContainer = null;
        this.metrics = {
            fps: 0,
            frameTime: 0,
            frames: 0,
            lastTime: performance.now(),
            lastFpsUpdate: performance.now(),
        };
        this.animationFrameId = null;
        this.isTracking = false;
    }

    /**
     * @method init
     * @description Инициализирует панель производительности.
     */
    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем контейнер для информации и кнопки
        const container = document.createElement('div');
        container.className = 'performance-container';

        // Создаем кнопку переключения
        const toggleButton = document.createElement('button');
        toggleButton.className = 'performance-toggle';
        toggleButton.textContent = 'Start Tracking';
        toggleButton.onclick = e => {
            e.stopPropagation(); // Предотвращаем сворачивание панели
            this.toggleTracking(toggleButton);
        };

        // Создаем контейнер для информации
        this.infoContainer = document.createElement('div');
        this.infoContainer.className = 'performance-info hidden';

        // Добавляем элементы в контейнер
        container.appendChild(toggleButton);
        container.appendChild(this.infoContainer);

        // Добавляем контейнер в панель
        this.content.appendChild(container);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Восстанавливаем состояние сворачивания
        this.restoreState();

        // Восстанавливаем состояние отслеживания
        const savedTracking = localStorage.getItem('performance-tracking') === 'true';
        if (savedTracking) {
            this.toggleTracking(toggleButton);
        }
    }

    /**
     * @method toggleTracking
     * @private
     * @description Переключает отслеживание производительности.
     * @param {HTMLButtonElement} button - Кнопка переключения.
     */
    toggleTracking(button) {
        this.isTracking = !this.isTracking;
        button.textContent = this.isTracking ? 'Stop Tracking' : 'Start Tracking';
        button.classList.toggle('active', this.isTracking);

        // Показываем/скрываем контейнер с информацией через CSS класс
        this.infoContainer.classList.toggle('hidden', !this.isTracking);

        // Сохраняем состояние в localStorage
        localStorage.setItem('performance-tracking', this.isTracking);

        // Обновляем высоту контента для анимации
        if (this.isTracking) {
            this.startTracking();
        } else {
            this.stopTracking();
        }
    }

    /**
     * @method startTracking
     * @private
     * @description Начинает отслеживание метрик производительности.
     */
    startTracking() {
        // Сбрасываем метрики
        this.metrics = {
            fps: 0,
            frameTime: 0,
            frames: 0,
            lastTime: performance.now(),
            lastFpsUpdate: performance.now(),
        };

        const updateMetrics = () => {
            if (!this.isTracking) return;

            const now = performance.now();
            const delta = now - this.metrics.lastTime;

            // Обновляем счетчик кадров
            this.metrics.frames++;

            // Обновляем FPS каждую секунду
            if (now - this.metrics.lastFpsUpdate >= 1000) {
                this.metrics.fps = Math.round((this.metrics.frames * 1000) / (now - this.metrics.lastFpsUpdate));
                this.metrics.frameTime = ((now - this.metrics.lastFpsUpdate) / this.metrics.frames).toFixed(2);
                this.metrics.frames = 0;
                this.metrics.lastFpsUpdate = now;
                this.updateInfo();
            }

            this.metrics.lastTime = now;
            this.animationFrameId = requestAnimationFrame(updateMetrics);
        };

        updateMetrics();
    }

    /**
     * @method stopTracking
     * @private
     * @description Останавливает отслеживание производительности.
     */
    stopTracking() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * @method updateInfo
     * @private
     * @description Обновляет отображение метрик.
     */
    updateInfo() {
        const { fps, frameTime } = this.metrics;
        const memory = this.getMemoryInfo();

        this.infoContainer.innerHTML = `
            <div class="performance-row">
                <span class="performance-label">FPS:</span>
                <span class="performance-value ${this.getFpsClass(fps)}">${fps}</span>
            </div>
            <div class="performance-row">
                <span class="performance-label">Frame Time:</span>
                <span class="performance-value">${frameTime} ms</span>
            </div>
            ${
                memory
                    ? `
            <div class="performance-row">
                <span class="performance-label">Memory:</span>
                <span class="performance-value">${memory}</span>
            </div>
            `
                    : ''
            }
        `;
    }

    /**
     * @method getFpsClass
     * @private
     * @description Возвращает CSS класс для значения FPS.
     */
    getFpsClass(fps) {
        if (fps >= 55) return 'performance-good';
        if (fps >= 30) return 'performance-warning';
        return 'performance-bad';
    }

    /**
     * @method getMemoryInfo
     * @private
     * @description Возвращает информацию о памяти, если доступно.
     */
    getMemoryInfo() {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            const used = (memory.usedJSHeapSize / 1048576).toFixed(1);
            const total = (memory.totalJSHeapSize / 1048576).toFixed(1);
            return `${used}MB / ${total}MB`;
        }
        return null;
    }

    /**
     * @method dispose
     * @description Освобождает ресурсы панели.
     */
    dispose() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
