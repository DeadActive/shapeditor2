import { Command } from './Command.js';

/**
 * @class SetCanvasSizeCommand
 * @extends Command
 * @description Команда для изменения размера холста.
 */
export class SetCanvasSizeCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     * @param {number} width - Новая ширина.
     * @param {number} height - Новая высота.
     */
    constructor(canvas, width, height) {
        super();
        this.canvas = canvas;
        this.newWidth = width;
        this.newHeight = height;
        this.oldWidth = canvas.width;
        this.oldHeight = canvas.height;
    }

    execute() {
        this.canvas.setSize(this.newWidth, this.newHeight);
    }

    undo() {
        this.canvas.setSize(this.oldWidth, this.oldHeight);
    }
}

/**
 * @class SetViewBoxCommand
 * @extends Command
 * @description Команда для изменения области просмотра.
 */
export class SetViewBoxCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     * @param {number} width - Ширина.
     * @param {number} height - Высота.
     */
    constructor(canvas, x, y, width, height) {
        super();
        this.canvas = canvas;
        this.newViewBox = { x, y, width, height };
        this.oldViewBox = { ...canvas.viewBox };
    }

    execute() {
        const { x, y, width, height } = this.newViewBox;
        this.canvas.setViewBox(x, y, width, height);
    }

    undo() {
        const { x, y, width, height } = this.oldViewBox;
        this.canvas.setViewBox(x, y, width, height);
    }
}

/**
 * @class PanCanvasCommand
 * @extends Command
 * @description Команда для перемещения области просмотра.
 */
export class PanCanvasCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    constructor(canvas, dx, dy) {
        super();
        this.canvas = canvas;
        this.dx = dx;
        this.dy = dy;
        this.oldViewBox = { ...canvas.viewBox };
    }

    execute() {
        this.canvas.pan(this.dx, this.dy);
    }

    undo() {
        const { x, y, width, height } = this.oldViewBox;
        this.canvas.setViewBox(x, y, width, height);
    }
}

/**
 * @class ZoomCanvasCommand
 * @extends Command
 * @description Команда для масштабирования холста.
 */
export class ZoomCanvasCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     * @param {number} scale - Коэффициент масштабирования.
     * @param {number} centerX - Центр масштабирования по X.
     * @param {number} centerY - Центр масштабирования по Y.
     */
    constructor(canvas, scale, centerX, centerY) {
        super();
        this.canvas = canvas;
        this.scale = scale;
        this.centerX = centerX;
        this.centerY = centerY;
        this.oldViewBox = { ...canvas.viewBox };
    }

    execute() {
        this.canvas.zoom(this.scale, this.centerX, this.centerY);
    }

    undo() {
        const { x, y, width, height } = this.oldViewBox;
        this.canvas.setViewBox(x, y, width, height);
    }
}

/**
 * @class CanvasTransformCommand
 * @extends Command
 * @description Команда для объединения трансформаций холста с накоплением изменений.
 */
export class CanvasTransformCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     */
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.isExecuting = false;
        this.timeout = null;
        this.totalDx = 0;
        this.totalDy = 0;
        this.oldViewBox = null;
    }

    /**
     * @method addTransform
     * @description Добавляет трансформацию к общему смещению.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    addTransform(dx, dy) {
        if (!this.isExecuting) {
            this.oldViewBox = { ...this.canvas.viewBox };
            this.isExecuting = true;
        }

        this.totalDx += dx;
        this.totalDy += dy;

        this.canvas.pan(dx, dy);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.isExecuting = false;
            this.timeout = null;
        }, 300);
    }

    execute() {
        if (this.oldViewBox) {
            const currentViewBox = { ...this.canvas.viewBox };
            this.canvas.setViewBox(
                this.oldViewBox.x + this.totalDx,
                this.oldViewBox.y + this.totalDy,
                currentViewBox.width,
                currentViewBox.height
            );
        }
    }

    undo() {
        if (this.oldViewBox) {
            this.canvas.setViewBox(this.oldViewBox.x, this.oldViewBox.y, this.oldViewBox.width, this.oldViewBox.height);
        }
    }
}

/**
 * @class CanvasResizeCommand
 * @extends Command
 * @description Команда для изменения размера холста с накоплением изменений.
 */
export class CanvasResizeCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     */
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.timeout = null;
        this.oldSize = null;
        this.newSize = null;
    }

    /**
     * @method addResize
     * @description Обновляет конечный размер холста.
     * @param {number} width - Новая ширина.
     * @param {number} height - Новая высота.
     */
    addResize(width, height) {
        if (!this.oldSize) {
            this.oldSize = {
                width: this.canvas.width,
                height: this.canvas.height,
            };
        }

        this.newSize = { width, height };

        this.canvas.setSize(width, height);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.timeout = null;
        }, 300);
    }

    execute() {
        if (this.oldSize && this.newSize) {
            this.canvas.setSize(this.newSize.width, this.newSize.height);
        }
    }

    undo() {
        if (this.oldSize) {
            this.canvas.setSize(this.oldSize.width, this.oldSize.height);
        }
    }
}

/**
 * @class AccumulatedZoomCommand
 * @extends Command
 * @description Команда для накопления операций масштабирования холста.
 */
export class AccumulatedZoomCommand extends Command {
    /**
     * @param {Canvas} canvas - Холст.
     */
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.isExecuting = false;
        this.timeout = null;
        this.oldViewBox = null;
        this.totalScale = 1;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
    }

    /**
     * @method addZoom
     * @description Добавляет масштабирование к общему преобразованию.
     * @param {number} scale - Коэффициент масштабирования.
     * @param {number} centerX - Центр масштабирования по X.
     * @param {number} centerY - Центр масштабирования по Y.
     */
    addZoom(scale, centerX, centerY) {
        if (!this.isExecuting) {
            this.oldViewBox = { ...this.canvas.viewBox };
            this.isExecuting = true;
        }

        this.totalScale *= scale;
        this.lastCenterX = centerX;
        this.lastCenterY = centerY;

        // Применяем текущее масштабирование
        this.canvas.zoom(scale, centerX, centerY);

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.isExecuting = false;
            this.timeout = null;
        }, 300);
    }

    execute() {
        if (this.oldViewBox) {
            // Применяем общее масштабирование одной операцией
            this.canvas.zoom(this.totalScale, this.lastCenterX, this.lastCenterY);
        }
    }

    undo() {
        if (this.oldViewBox) {
            this.canvas.setViewBox(this.oldViewBox.x, this.oldViewBox.y, this.oldViewBox.width, this.oldViewBox.height);
        }
    }
}
