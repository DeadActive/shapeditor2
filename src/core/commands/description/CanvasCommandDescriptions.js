import { CommandDescription } from './CommandDescription.js';
import {
    CanvasTransformCommand,
    CanvasResizeCommand,
    SetCanvasSizeCommand,
    SetViewBoxCommand,
    PanCanvasCommand,
    ZoomCanvasCommand,
} from '../CanvasCommands.js';

export class CanvasTransformDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Pan Canvas (dx: ${command.totalDx.toFixed(1)}, dy: ${command.totalDy.toFixed(1)})`;
    }
}

export class CanvasResizeDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        if (command.newSize) {
            return `Resize Canvas (${command.newSize.width}x${command.newSize.height})`;
        }
        return 'Resize Canvas';
    }
}

export class SetCanvasSizeDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Set Canvas Size (${command.newWidth}x${command.newHeight})`;
    }
}

export class SetViewBoxDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        const { x, y, width, height } = command.newViewBox;
        return `Set ViewBox (${x}, ${y}, ${width}, ${height})`;
    }
}

export class PanCanvasDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Pan (${command.dx}, ${command.dy})`;
    }
}

export class ZoomCanvasDescription extends CommandDescription {
    getDescription() {
        const command = this.command;
        return `Zoom (scale: ${command.scale.toFixed(2)})`;
    }
}
