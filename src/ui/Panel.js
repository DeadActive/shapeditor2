/**
 * @class Panel
 * @description Базовый класс для всех панелей с поддержкой сворачивания.
 */
export class Panel {
    /**
     * @param {string} title - Заголовок панели.
     * @param {string} className - CSS класс панели.
     */
    constructor(title, className) {
        this.title = title;
        this.className = className;
        this.panel = null;
        this.content = null;
        this.isCollapsed = false;
    }

    /**
     * @method createPanel
     * @description Создает базовую структуру панели.
     * @returns {HTMLElement} DOM элемент панели.
     */
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = this.className;

        // Создаем заголовок
        const header = document.createElement('div');
        header.className = 'panel-header';

        const title = document.createElement('h3');
        title.textContent = this.title;

        const collapseButton = document.createElement('div');
        collapseButton.className = 'collapse-button';
        collapseButton.textContent = '▼';

        header.appendChild(title);
        header.appendChild(collapseButton);

        // Создаем контейнер для содержимого
        this.content = document.createElement('div');
        this.content.className = 'panel-content';

        // Добавляем обработчик сворачивания
        header.addEventListener('click', () => this.toggleCollapse());

        this.panel.appendChild(header);
        this.panel.appendChild(this.content);

        return this.panel;
    }

    /**
     * @method toggleCollapse
     * @description Переключает состояние сворачивания панели.
     */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;

        const button = this.panel.querySelector('.collapse-button');
        const content = this.panel.querySelector('.panel-content');
        const header = this.panel.querySelector('.panel-header');

        if (this.isCollapsed) {
            button.classList.add('collapsed');
            content.classList.add('collapsed');
            header.classList.add('collapsed');
        } else {
            button.classList.remove('collapsed');
            content.classList.remove('collapsed');
            header.classList.remove('collapsed');
        }

        // Сохраняем состояние в localStorage
        localStorage.setItem(`${this.className}-collapsed`, this.isCollapsed);

        // Обновляем layout стека
        if (this.panel.parentElement?.classList.contains('panel-stack')) {
            setTimeout(() => {
                const event = new CustomEvent('panelToggle');
                this.panel.parentElement.dispatchEvent(event);
            }, 300); // После анимации
        }
    }

    /**
     * @method restoreState
     * @description Восстанавливает состояние сворачивания панели.
     */
    restoreState() {
        const savedState = localStorage.getItem(`${this.className}-collapsed`);
        if (savedState === 'true') {
            this.toggleCollapse();
        }
    }
}
