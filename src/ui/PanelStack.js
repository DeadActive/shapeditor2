/**
 * @class PanelStack
 * @description Управляет вертикальным стеком панелей с использованием flex layout.
 */
export class PanelStack {
    constructor() {
        this.panels = [];
        this.stack = document.createElement('div');
        this.stack.className = 'panel-stack';
        document.body.appendChild(this.stack);

        // Добавляем слушатель для обновления высоты контента при сворачивании
        this.stack.addEventListener('panelToggle', () => {
            this.panels.forEach(panel => {
                if (!panel.isCollapsed) {
                    panel.content.style.height = panel.content.scrollHeight + 'px';
                }
            });
        });
    }

    /**
     * @method addPanel
     * @description Добавляет панель в стек.
     * @param {Panel} panel - Панель для добавления.
     */
    addPanel(panel) {
        this.panels.push(panel);
        this.stack.appendChild(panel.panel);
    }

    /**
     * @method dispose
     * @description Удаляет стек и очищает ресурсы.
     */
    dispose() {
        this.stack.remove();
        this.panels = [];
    }
}
