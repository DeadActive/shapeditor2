import { Panel } from './Panel.js';

/**
 * @class ExamplePanel
 * @extends Panel
 * @description UI панель для переключения между примерами.
 */
export class ExamplePanel extends Panel {
    constructor(exampleManager) {
        super('Examples', 'example-panel');
        this.exampleManager = exampleManager;
        this.selectElement = null;
        this.descriptionElement = null;
    }

    init() {
        // Создаем базовую структуру панели
        const panel = this.createPanel();

        // Создаем контейнер для селекта и описания
        const container = document.createElement('div');
        container.className = 'example-container';

        // Создаем селект для выбора примера
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'example-select';

        // Получаем список примеров и создаем опции
        const examples = this.exampleManager.getExampleList();
        examples.forEach(example => {
            const option = document.createElement('option');
            option.value = example.id;
            option.textContent = example.name;
            this.selectElement.appendChild(option);
        });

        // Добавляем обработчик изменения
        this.selectElement.addEventListener('change', () => {
            this.exampleManager.loadExample(this.selectElement.value);
            this.updateDescription();
        });

        // Создаем описание примера
        this.descriptionElement = document.createElement('p');
        this.descriptionElement.className = 'example-description';

        // Собираем панель
        container.appendChild(this.selectElement);
        container.appendChild(this.descriptionElement);

        // Добавляем контейнер в content вместо panel
        this.content.appendChild(container);

        // Добавляем панель на страницу
        document.body.appendChild(panel);

        // Восстанавливаем состояние сворачивания
        this.restoreState();
    }

    /**
     * @method updateDescription
     * @private
     * @description Обновляет описание текущего примера.
     */
    updateDescription() {
        const currentExample = this.exampleManager.getCurrentExample();
        if (currentExample) {
            this.descriptionElement.textContent = currentExample.description;
            // Устанавливаем значение селекта
            this.selectElement.value = currentExample.id;
        }
    }
}
