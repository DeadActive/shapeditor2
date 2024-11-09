import { Panel } from './Panel.js';

/**
 * @class RenderModePanel
 * @extends Panel
 * @description UI панель для переключения режимов рендеринга.
 */
export class RenderModePanel extends Panel {
    /**
     * @param {Renderer} renderer - Рендерер.
     */
    constructor(renderer) {
        super('Render Mode', 'render-mode-panel');
        this.renderer = renderer;
        this.currentMode = 'fast'; // Default mode
    }

    /**
     * @method init
     * @description Инициализирует панель выбора режима рендеринга.
     */
    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем контейнер для радио кнопок
        const container = document.createElement('div');
        container.className = 'render-mode-container';

        // Создаем радио кнопки для каждого режима
        const modes = [
            { id: 'fast', name: 'Fast', description: 'Optimized for performance' },
            { id: 'pretty', name: 'Pretty', description: 'Better visual quality' },
        ];

        modes.forEach(mode => {
            const label = document.createElement('label');
            label.className = 'render-mode-option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'renderMode';
            radio.value = mode.id;
            radio.checked = mode.id === this.currentMode;

            const textContainer = document.createElement('div');
            textContainer.className = 'render-mode-text';

            const modeName = document.createElement('span');
            modeName.className = 'render-mode-name';
            modeName.textContent = mode.name;

            const modeDesc = document.createElement('span');
            modeDesc.className = 'render-mode-description';
            modeDesc.textContent = mode.description;

            textContainer.appendChild(modeName);
            textContainer.appendChild(modeDesc);

            label.appendChild(radio);
            label.appendChild(textContainer);
            container.appendChild(label);

            // Добавляем обработчик изменения
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.setRenderMode(mode.id);
                }
            });
        });

        // Добавляем контейнер в content вместо panel
        this.content.appendChild(container);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Устанавливаем начальный режим
        this.setRenderMode(this.currentMode);

        // Восстанавливаем состояние сворачивания
        this.restoreState();
    }

    /**
     * @method setRenderMode
     * @private
     * @description Устанавливает режим рендеринга.
     * @param {string} mode - Режим рендеринга ('fast' или 'pretty').
     */
    setRenderMode(mode) {
        this.currentMode = mode;
        const shapeRendering = mode === 'fast' ? 'optimizeSpeed' : 'geometricPrecision';
        document.documentElement.style.setProperty('--shape-rendering', shapeRendering);
    }
}
